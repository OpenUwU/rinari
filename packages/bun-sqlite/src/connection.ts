import { Database } from 'bun:sqlite';
import { join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';

/**
 * Options for establishing a database connection.
 *
 * @remarks
 * Configure connection behavior including file location, access mode,
 * and logging. Optimized for Bun's native SQLite implementation.
 *
 * @example
 * ```typescript
 * const options: ConnectionOptions = {
 *   filepath: './data/mydb.sqlite',
 *   readonly: false,
 *   verbose: true
 * };
 * ```
 *
 * @public
 */
export interface ConnectionOptions {
  /**
   * Path to the SQLite database file.
   * Parent directories will be created automatically if they don't exist.
   */
  filepath: string;

  /**
   * Open database in read-only mode.
   * @defaultValue false
   */
  readonly?: boolean;

  /**
   * Throw an error if the database file doesn't exist.
   * @defaultValue false
   */
  create?: boolean;

  /**
   * Enable verbose logging (logs all SQL statements).
   * @defaultValue false
   */
  verbose?: boolean;
}

/**
 * Database connection wrapper for Bun's native SQLite.
 *
 * @remarks
 * Manages a single SQLite database connection using Bun's high-performance
 * native implementation. Automatically configures WAL mode, foreign keys,
 * and optimal caching settings.
 *
 * @example
 * Basic connection:
 * ```typescript
 * import { Connection } from '@rinari/bun-sqlite';
 *
 * const conn = new Connection({
 *   filepath: './data/mydb.sqlite',
 *   verbose: true
 * });
 *
 * const result = conn.query('SELECT * FROM users').all();
 *
 * conn.close();
 * ```
 *
 * @example
 * Transaction usage:
 * ```typescript
 * const result = conn.transaction(() => {
 *   conn.query('INSERT INTO users (username) VALUES ($username)').run({ $username: 'alice' });
 *   conn.query('INSERT INTO profiles (user_id) VALUES ($uid)').run({ $uid: 1 });
 *   return conn.query('SELECT * FROM users WHERE username = $username').get({ $username: 'alice' });
 * });
 * ```
 *
 * @public
 */
export class Connection {
  private db: Database;
  private filepath: string;
  private isOpen: boolean = false;
  private verboseMode: boolean = false;

  /**
   * Creates a new database connection using Bun's native SQLite.
   *
   * @param options - Connection configuration
   *
   * @remarks
   * The connection is automatically opened and optimized with:
   * - WAL (Write-Ahead Logging) mode for better concurrency
   * - NORMAL synchronous mode for balance of safety and speed
   * - Foreign key constraints enabled
   * - Memory-based temp storage for performance
   *
   * @example
   * ```typescript
   * const conn = new Connection({
   *   filepath: './data/app.db',
   *   verbose: false
   * });
   * ```
   */
  constructor(options: ConnectionOptions) {
    this.filepath = options.filepath;
    this.verboseMode = options.verbose ?? false;

    const dir = join(this.filepath, '..');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.filepath, {
      readonly: options.readonly ?? false,
      create: options.create ?? true,
    });

    this.db.exec('PRAGMA journal_mode = WAL');
    this.db.exec('PRAGMA synchronous = NORMAL');
    this.db.exec('PRAGMA temp_store = MEMORY');
    this.db.exec('PRAGMA foreign_keys = ON');

    this.isOpen = true;
  }

  /**
   * Get the underlying Bun SQLite database instance.
   *
   * @throws {Error} If the connection is closed
   *
   * @example
   * ```typescript
   * const db = conn.database;
   * db.run('VACUUM');
   * ```
   */
  get database(): Database {
    if (!this.isOpen) {
      throw new Error('Database connection is closed');
    }
    return this.db;
  }

  /**
   * Create a prepared SQL query.
   *
   * @param sql - SQL statement
   * @returns Prepared query
   *
   * @remarks
   * In Bun SQLite, this returns a Query object with `.all()`, `.get()`, and `.run()` methods.
   * Queries are automatically cached by Bun for performance.
   *
   * @example
   * ```typescript
   * const query = conn.query('SELECT * FROM users WHERE age > $age');
   * const users = query.all({ $age: 18 });
   * ```
   */
  query(sql: string): ReturnType<Database['query']> {
    if (this.verboseMode) {
      console.log('[SQL]', sql);
    }
    return this.db.query(sql);
  }

  /**
   * Prepare a SQL statement for execution (alias for query).
   *
   * @param sql - SQL statement
   * @returns Prepared statement
   *
   * @example
   * ```typescript
   * const stmt = conn.prepare('SELECT * FROM users WHERE age > $age');
   * const users = stmt.all({ $age: 18 });
   * ```
   */
  prepare(sql: string): ReturnType<Database['query']> {
    return this.query(sql);
  }

  /**
   * Execute raw SQL without prepared statements.
   *
   * @param sql - SQL statement(s) to execute
   * @returns this for method chaining
   *
   * @remarks
   * Use this for DDL operations or multi-statement execution.
   * For single queries with parameters, use {@link query}.
   *
   * @example
   * ```typescript
   * conn.exec(`
   *   CREATE TABLE IF NOT EXISTS users (
   *     id INTEGER PRIMARY KEY,
   *     username TEXT UNIQUE
   *   );
   *   CREATE INDEX idx_username ON users(username);
   * `);
   * ```
   */
  exec(sql: string): this {
    if (this.verboseMode) {
      console.log('[SQL EXEC]', sql);
    }
    this.db.exec(sql);
    return this;
  }

  /**
   * Execute a transaction.
   *
   * @typeParam T - Transaction return type
   * @param fn - Transaction callback
   * @returns Transaction result
   *
   * @remarks
   * All operations in the callback are executed atomically.
   * If an error occurs, all changes are rolled back automatically.
   * Bun's transaction implementation is highly optimized.
   *
   * @example
   * ```typescript
   * const user = conn.transaction(() => {
   *   const info = conn.query('INSERT INTO users (username) VALUES ($name)').run({ $name: 'alice' });
   *   conn.query('INSERT INTO profiles (user_id, bio) VALUES ($id, $bio)').run({
   *     $id: info.lastInsertRowid,
   *     $bio: 'Hello'
   *   });
   *   return conn.query('SELECT * FROM users WHERE id = $id').get({ $id: info.lastInsertRowid });
   * });
   * ```
   *
   * @example
   * Transaction with error handling:
   * ```typescript
   * try {
   *   conn.transaction(() => {
   *     conn.query('INSERT INTO users (username) VALUES ($name)').run({ $name: 'alice' });
   *     throw new Error('Rollback!');
   *   });
   * } catch (error) {
   *   console.log('Transaction rolled back');
   * }
   * ```
   */
  transaction<T>(fn: () => T): T {
    const trx = this.db.transaction(fn);
    return trx();
  }

  /**
   * Close the database connection and release resources.
   *
   * @remarks
   * Always call this method when you're done using the connection
   * to prevent resource leaks.
   *
   * @example
   * ```typescript
   * const conn = new Connection({ filepath: './data/app.db' });
   * try {
   *   // ... use connection
   * } finally {
   *   conn.close();
   * }
   * ```
   */
  close(): void {
    if (this.isOpen) {
      this.db.close();
      this.isOpen = false;
    }
  }

  /**
   * Check if a transaction is currently active.
   *
   * @example
   * ```typescript
   * conn.transaction(() => {
   *   console.log(conn.inTransaction); // true
   * });
   * console.log(conn.inTransaction); // false
   * ```
   */
  get inTransaction(): boolean {
    return this.db.inTransaction;
  }

  /**
   * Perform a WAL checkpoint.
   *
   * @param mode - Checkpoint mode
   * @returns this for method chaining
   *
   * @remarks
   * WAL checkpoints transfer data from the WAL file to the main database file.
   * - PASSIVE: Checkpoint as much as possible without blocking
   * - FULL: Wait for all transactions and checkpoint everything
   * - RESTART: Full checkpoint and restart the WAL
   * - TRUNCATE: Restart and truncate the WAL file
   *
   * @example
   * ```typescript
   * conn.checkpoint('TRUNCATE');
   * ```
   */
  checkpoint(mode?: 'PASSIVE' | 'FULL' | 'RESTART' | 'TRUNCATE'): this {
    this.db.exec(`PRAGMA wal_checkpoint(${mode ?? 'PASSIVE'})`);
    return this;
  }

  /**
   * Optimize the database.
   *
   * @returns this for method chaining
   *
   * @remarks
   * Updates internal statistics used by the query optimizer.
   * Run this periodically for better query performance.
   *
   * @example
   * ```typescript
   * conn.optimize();
   * ```
   */
  optimize(): this {
    this.db.exec('PRAGMA optimize');
    return this;
  }

  /**
   * Compact the database file by rebuilding it.
   *
   * @returns this for method chaining
   *
   * @remarks
   * VACUUM reclaims unused space and defragments the database.
   * This can be slow on large databases.
   *
   * @example
   * ```typescript
   * conn.vacuum();
   * ```
   */
  vacuum(): this {
    this.db.exec('VACUUM');
    return this;
  }

  /**
   * Analyze the database to update optimizer statistics.
   *
   * @returns this for method chaining
   *
   * @remarks
   * ANALYZE gathers statistics about table content to help the query planner.
   * Run this after significant data changes.
   *
   * @example
   * ```typescript
   * conn.analyze();
   * ```
   */
  analyze(): this {
    this.db.exec('ANALYZE');
    return this;
  }

  /**
   * Get the filename of the database.
   *
   * @returns Database filename
   *
   * @example
   * ```typescript
   * console.log(conn.filename); // './data/app.db'
   * ```
   */
  get filename(): string {
    return this.db.filename;
  }
}
