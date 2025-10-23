import type {
  SyncDriver,
  DriverConfig,
  DriverMetadata,
  TableSchema,
  QueryOptions,
  IndexOptions,
} from '@rinari/types';
import { Connection } from './connection.js';
import { QueryBuilder } from './query-builder.js';
import { SchemaManager } from './schema.js';

/**
 * Synchronous SQLite driver for Rinari ORM.
 *
 * @remarks
 * High-performance SQLite driver built on better-sqlite3 with support for:
 * - Multiple database files
 * - ACID transactions
 * - Advanced query operators
 * - Index management
 * - WAL mode for better concurrency
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { SQLiteDriver } from '@rinari/sqlite';
 * import { ORM } from '@rinari/orm';
 * import { DataTypes } from '@rinari/types';
 *
 * const driver = new SQLiteDriver({
 *   storageDir: './data',
 *   verbose: false
 * });
 *
 * const orm = new ORM({ driver });
 *
 * const User = orm.define('default', 'users', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *   username: { type: DataTypes.TEXT, notNull: true, unique: true },
 *   email: { type: DataTypes.TEXT, notNull: true, unique: true }
 * });
 *
 * const user = User.create({
 *   username: 'alice',
 *   email: 'alice@example.com'
 * });
 * ```
 *
 * @example
 * Multi-database setup:
 * ```typescript
 * const driver = new SQLiteDriver({
 *   storageDir: './data'
 * });
 *
 * const orm = new ORM({ driver });
 *
 * const User = orm.define('users_db', 'users', userSchema);
 * const Product = orm.define('products_db', 'products', productSchema);
 *
 * console.log('Databases:', orm.getDatabases()); // ['users_db', 'products_db']
 * ```
 *
 * @public
 */
export class SQLiteDriver implements SyncDriver {
  /**
   * Driver metadata.
   */
  readonly metadata: DriverMetadata = {
    name: 'sqlite',
    version: '1.0.0',
  };

  private connections: Map<string, Connection> = new Map();
  private queryBuilders: Map<string, QueryBuilder> = new Map();
  private schemaManagers: Map<string, SchemaManager> = new Map();
  private config: DriverConfig;
  private storageDir: string;

  /**
   * Creates a new SQLite driver instance.
   *
   * @param config - Driver configuration
   *
   * @remarks
   * The driver will create database files in the specified storage directory.
   * Each database name maps to a separate .sqlite file.
   *
   * @example
   * ```typescript
   * const driver = new SQLiteDriver({
   *   storageDir: './data',
   *   verbose: true,
   *   readonly: false
   * });
   * ```
   */
  constructor(config: DriverConfig) {
    if (typeof (globalThis as any).Bun !== 'undefined') {
      console.warn('\n⚠️  WARNING: You are using @rinari/sqlite with Bun runtime.');
      console.warn('  bun support is experimental ');
    }

    this.config = config;
    this.storageDir = config.storageDir;
    this.connect(config);
  }

  /**
   * Connect to the database(s).
   *
   * @param config - Driver configuration
   *
   * @remarks
   * This method updates the configuration. Actual database connections
   * are created lazily when they're first accessed.
   *
   * @example
   * ```typescript
   * driver.connect({
   *   storageDir: './data',
   *   verbose: true
   * });
   * ```
   */
  connect(config: DriverConfig): void {
    this.config = config;
    this.storageDir = config.storageDir;
  }

  /**
   * @internal
   * Initialize a connection for a specific database.
   */
  private initializeConnection(dbName: string, filepath: string, config: DriverConfig): void {
    const connection = new Connection({
      filepath,
      readonly: config.readonly,
      verbose: config.verbose,
    });

    this.connections.set(dbName, connection);
    this.queryBuilders.set(dbName, new QueryBuilder(connection));
    this.schemaManagers.set(dbName, new SchemaManager(connection));
  }

  /**
   * @internal
   * Get or create a connection for a database.
   */
  private getConnection(dbName: string): Connection {
    let connection = this.connections.get(dbName);

    if (!connection) {
      const filepath = `${this.storageDir}/${dbName}.sqlite`;
      this.initializeConnection(dbName, filepath, this.config);
      connection = this.connections.get(dbName)!;
    }

    return connection;
  }

  /**
   * @internal
   * Get or create a query builder for a database.
   */
  private getQueryBuilder(dbName: string): QueryBuilder {
    let qb = this.queryBuilders.get(dbName);
    if (!qb) {
      this.getConnection(dbName);
      qb = this.queryBuilders.get(dbName);
      if (!qb) {
        throw new Error(`Failed to initialize query builder for database: ${dbName}`);
      }
    }
    return qb;
  }

  /**
   * @internal
   * Get or create a schema manager for a database.
   */
  private getSchemaManager(dbName: string): SchemaManager {
    let sm = this.schemaManagers.get(dbName);
    if (!sm) {
      this.getConnection(dbName);
      sm = this.schemaManagers.get(dbName);
      if (!sm) {
        throw new Error(`Failed to initialize schema manager for database: ${dbName}`);
      }
    }
    return sm;
  }

  /**
   * Disconnect from all databases and cleanup resources.
   *
   * @remarks
   * Always call this method when you're done using the driver to prevent
   * resource leaks and ensure proper database file closure.
   *
   * @example
   * ```typescript
   * try {
   *   // ... use driver
   * } finally {
   *   driver.disconnect();
   * }
   * ```
   */
  disconnect(): void {
    for (const connection of this.connections.values()) {
      connection.close();
    }
    this.connections.clear();
    this.queryBuilders.clear();
    this.schemaManagers.clear();
  }

  /**
   * Create a new table in the specified database.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param schema - Table schema definition
   *
   * @example
   * ```typescript
   * driver.createTable('default', 'users', {
   *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   *   username: { type: DataTypes.TEXT, notNull: true, unique: true }
   * });
   * ```
   */
  createTable(dbName: string, tableName: string, schema: TableSchema): void {
    const schemaManager = this.getSchemaManager(dbName);
    schemaManager.createTable(tableName, schema);
  }

  /**
   * Drop a table from the specified database.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   *
   * @example
   * ```typescript
   * driver.dropTable('default', 'old_users');
   * ```
   */
  dropTable(dbName: string, tableName: string): void {
    const schemaManager = this.getSchemaManager(dbName);
    schemaManager.dropTable(tableName);
  }

  /**
   * Check if a table exists in the specified database.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @returns True if table exists, false otherwise
   *
   * @example
   * ```typescript
   * if (driver.tableExists('default', 'users')) {
   *   console.log('Users table exists');
   * }
   * ```
   */
  tableExists(dbName: string, tableName: string): boolean {
    const schemaManager = this.getSchemaManager(dbName);
    return schemaManager.tableExists(tableName);
  }

  /**
   * Find a single record matching the query options.
   *
   * @typeParam T - Expected return type
   * @param dbName - Database name
   * @param tableName - Table name
   * @param options - Query options
   * @returns Matching record or null
   *
   * @example
   * ```typescript
   * const user = driver.findOne<User>('default', 'users', {
   *   where: { username: 'alice' }
   * });
   * ```
   */
  findOne<T = any>(dbName: string, tableName: string, options: QueryOptions): T | null {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.findOne(tableName, options);
  }

  /**
   * Find all records matching the query options.
   *
   * @typeParam T - Expected return type
   * @param dbName - Database name
   * @param tableName - Table name
   * @param options - Query options
   * @returns Array of matching records
   *
   * @example
   * ```typescript
   * const users = driver.findAll<User>('default', 'users', {
   *   where: { age: { $gte: 18 } },
   *   orderBy: [['age', 'ASC']],
   *   limit: 10
   * });
   * ```
   */
  findAll<T = any>(dbName: string, tableName: string, options: QueryOptions): T[] {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.findAll(tableName, options);
  }

  /**
   * Count records matching the where condition.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param where - Optional filter conditions
   * @returns Number of matching records
   *
   * @example
   * ```typescript
   * const count = driver.count('default', 'users', { status: 'active' });
   * ```
   */
  count(dbName: string, tableName: string, where?: Record<string, any>): number {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.count(tableName, { where });
  }

  /**
   * Insert a new record.
   *
   * @typeParam T - Expected return type
   * @param dbName - Database name
   * @param tableName - Table name
   * @param data - Record data
   * @returns Inserted record with generated ID
   *
   * @example
   * ```typescript
   * const user = driver.insert<User>('default', 'users', {
   *   username: 'alice',
   *   email: 'alice@example.com'
   * });
   * ```
   */
  insert<T = any>(dbName: string, tableName: string, data: Record<string, any>): T {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.insert(tableName, data);
  }

  /**
   * Insert multiple records in a single transaction.
   *
   * @typeParam T - Expected return type
   * @param dbName - Database name
   * @param tableName - Table name
   * @param records - Array of records to insert
   * @returns Array of inserted records with generated IDs
   *
   * @example
   * ```typescript
   * const users = driver.bulkInsert<User>('default', 'users', [
   *   { username: 'alice', email: 'alice@example.com' },
   *   { username: 'bob', email: 'bob@example.com' }
   * ]);
   * ```
   */
  bulkInsert<T = any>(dbName: string, tableName: string, records: Record<string, any>[]): T[] {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.bulkInsert(tableName, records);
  }

  /**
   * Update records matching the where condition.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param data - New values
   * @param where - Filter conditions
   * @returns Number of updated records
   *
   * @example
   * ```typescript
   * const updated = driver.update('default', 'users',
   *   { status: 'inactive' },
   *   { last_login: { $lt: '2024-01-01' } }
   * );
   * ```
   */
  update(
    dbName: string,
    tableName: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): number {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.update(tableName, data, where);
  }

  /**
   * Perform multiple updates in a single transaction.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param updates - Array of update operations
   * @returns Total number of updated records
   *
   * @example
   * ```typescript
   * const updated = driver.bulkUpdate('default', 'users', [
   *   { where: { id: 1 }, data: { status: 'active' } },
   *   { where: { id: 2 }, data: { status: 'inactive' } }
   * ]);
   * ```
   */
  bulkUpdate(
    dbName: string,
    tableName: string,
    updates: Array<{ where: Record<string, any>; data: Record<string, any> }>
  ): number {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.bulkUpdate(tableName, updates);
  }

  /**
   * Delete records matching the where condition.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param where - Filter conditions
   * @returns Number of deleted records
   *
   * @example
   * ```typescript
   * const deleted = driver.delete('default', 'users', { status: 'banned' });
   * ```
   */
  delete(dbName: string, tableName: string, where: Record<string, any>): number {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.delete(tableName, where);
  }

  /**
   * Create an index on specified columns.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param indexName - Index name
   * @param options - Index options
   *
   * @example
   * ```typescript
   * driver.createIndex('default', 'users', 'idx_email', {
   *   unique: true,
   *   columns: ['email']
   * });
   * ```
   */
  createIndex(dbName: string, tableName: string, indexName: string, options: IndexOptions): void {
    const schemaManager = this.getSchemaManager(dbName);
    schemaManager.createIndex(tableName, indexName, options);
  }

  /**
   * Drop an index.
   *
   * @param dbName - Database name
   * @param tableName - Table name (unused in SQLite)
   * @param indexName - Index name
   *
   * @example
   * ```typescript
   * driver.dropIndex('default', 'users', 'idx_email');
   * ```
   */
  dropIndex(dbName: string, tableName: string, indexName: string): void {
    const schemaManager = this.getSchemaManager(dbName);
    schemaManager.dropIndex(indexName);
  }

  /**
   * Execute a transaction.
   *
   * @typeParam T - Transaction return type
   * @param fn - Transaction callback
   * @returns Transaction result
   *
   * @remarks
   * All operations in the callback execute atomically.
   * If an error occurs, all changes are rolled back.
   *
   * @example
   * ```typescript
   * const result = driver.transaction(() => {
   *   const user = driver.insert('default', 'users', { username: 'alice' });
   *   driver.insert('default', 'profiles', { user_id: user.id, bio: 'Hello' });
   *   return user;
   * });
   * ```
   */
  transaction<T>(fn: () => T): T {
    const firstConnection = this.connections.values().next().value;
    if (!firstConnection) {
      throw new Error('No database connection available for transaction');
    }
    return firstConnection.transaction(fn);
  }

  /**
   * Perform an aggregation operation.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param operation - Aggregation operation (SUM, AVG, MIN, MAX, COUNT)
   * @param field - Field to aggregate
   * @param where - Optional filter conditions
   * @returns Aggregation result
   *
   * @example
   * ```typescript
   * const totalAge = driver.aggregate('default', 'users', 'SUM', 'age');
   * const avgAge = driver.aggregate('default', 'users', 'AVG', 'age', {
   *   status: 'active'
   * });
   * ```
   */
  aggregate(
    dbName: string,
    tableName: string,
    operation: string,
    field: string,
    where?: Record<string, any>
  ): number {
    const queryBuilder = this.getQueryBuilder(dbName);
    return queryBuilder.aggregate(tableName, operation, field, where);
  }

  /**
   * Get the connection instance for a specific database.
   *
   * @param dbName - Database name
   * @returns Connection instance
   *
   * @remarks
   * Use this to access lower-level database operations or better-sqlite3 features.
   *
   * @example
   * ```typescript
   * const conn = driver.getConnectionForDb('default');
   * conn.vacuum();
   * conn.analyze();
   * ```
   */
  getConnectionForDb(dbName: string): Connection {
    return this.getConnection(dbName);
  }
}
