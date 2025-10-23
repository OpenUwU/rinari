import Database from 'better-sqlite3';
import { join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';

/**
 * Options for establishing a database connection.
 *
 * @remarks
 * Configure connection behavior including file location, access mode,
 * timeouts, and logging.
 *
 * @example
 * ```typescript
 * const options: ConnectionOptions = {
 *   filepath: './data/mydb.sqlite',
 *   readonly: false,
 *   verbose: true,
 *   timeout: 10000
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
  fileMustExist?: boolean;

  /**
   * Timeout in milliseconds for database operations.
   * @defaultValue 5000
   */
  timeout?: number;

  /**
   * Enable verbose logging (logs all SQL statements).
   * @defaultValue false
   */
  verbose?: boolean;
}

/**
 * Database connection wrapper for better-sqlite3.
 *
 * @remarks
 * Manages a single SQLite database connection with optimized settings
 * for performance and reliability. Automatically configures WAL mode,
 * foreign keys, and caching.
 *
 * @example
 * Basic connection:
 * ```typescript
 * import { Connection } from '@rinari/sqlite';
 *
 * const conn = new Connection({
 *   filepath: './data/mydb.sqlite',
 *   verbose: true
 * });
 *
 * const result = conn.prepare('SELECT * FROM users').all();
 *
 * conn.close();
 * ```
 *
 * @example
 * Transaction usage:
 * ```typescript
 * const result = conn.transaction(() => {
 *   conn.prepare('INSERT INTO users (username) VALUES (?)').run('alice');
 *   conn.prepare('INSERT INTO profiles (user_id) VALUES (?)').run(1);
 *   return conn.prepare('SELECT * FROM users WHERE username = ?').get('alice');
 * });
 * ```
 *
 * @public
 */
export class Connection {
  private db: Database.Database;
  private filepath: string;
  private isOpen: boolean = false;

  /**
   * Creates a new database connection.
   *
   * @param options - Connection configuration
   *
   * @remarks
   * The connection is automatically opened and optimized with:
   * - WAL (Write-Ahead Logging) mode
   * - NORMAL synchronous mode
   * - 64MB cache size
   * - Memory-based temp storage
   * - Foreign key constraints enabled
   *
   * @example
   * ```typescript
   * const conn = new Connection({
   *   filepath: './data/app.db',
   *   verbose: false,
   *   timeout: 5000
   * });
   * ```
   */
  constructor(options: ConnectionOptions) {
    this.filepath = options.filepath;

    const dir = join(this.filepath, '..');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.filepath, {
      readonly: options.readonly ?? false,
      fileMustExist: options.fileMustExist ?? false,
      timeout: options.timeout ?? 5000,
      verbose: options.verbose ? console.log : undefined,
    });

    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = -64000');
    this.db.pragma('temp_store = MEMORY');
    this.db.pragma('foreign_keys = ON');

    this.isOpen = true;
  }

  /**
   * Get the underlying better-sqlite3 database instance.
   *
   * @throws {Error} If the connection is closed
   *
   * @example
   * ```typescript
   * const db = conn.database;
   * db.prepare('VACUUM').run();
   * ```
   */
  get database(): Database.Database {
    if (!this.isOpen) {
      throw new Error('Database connection is closed');
    }
    return this.db;
  }

  /**
   * Prepare a SQL statement for execution.
   *
   * @param sql - SQL statement
   * @returns Prepared statement
   *
   * @example
   * ```typescript
   * const stmt = conn.prepare('SELECT * FROM users WHERE age > ?');
   * const users = stmt.all(18);
   * ```
   */
  prepare(sql: string): Database.Statement {
    return this.db.prepare(sql);
  }

  /**
   * Execute raw SQL without prepared statements.
   *
   * @param sql - SQL statement(s) to execute
   * @returns this for method chaining
   *
   * @remarks
   * Use this for DDL operations or multi-statement execution.
   * For single queries with parameters, use {@link prepare}.
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
   *
   * @example
   * ```typescript
   * const user = conn.transaction(() => {
   *   const info = conn.prepare('INSERT INTO users (username) VALUES (?)').run('alice');
   *   conn.prepare('INSERT INTO profiles (user_id, bio) VALUES (?, ?)').run(info.lastInsertRowid, 'Hello');
   *   return conn.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
   * });
   * ```
   *
   * @example
   * Transaction with error handling:
   * ```typescript
   * try {
   *   conn.transaction(() => {
   *     conn.prepare('INSERT INTO users (username) VALUES (?)').run('alice');
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
    this.db.pragma(`wal_checkpoint(${mode ?? 'PASSIVE'})`);
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
    this.db.pragma('optimize');
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
   * Get memory usage statistics.
   *
   * @returns Object with used and highwater memory values in bytes
   *
   * @example
   * ```typescript
   * const mem = conn.memory;
   * console.log(`Database size: ${(mem.used / 1024 / 1024).toFixed(2)} MB`);
   * ```
   */
  get memory(): { used: number; highwater: number } {
    const used = this.db.pragma('page_count', { simple: true }) as number;
    const pageSize = this.db.pragma('page_size', { simple: true }) as number;
    return {
      used: used * pageSize,
      highwater: (this.db.pragma('max_page_count', { simple: true }) as number) * pageSize,
    };
  }
}
