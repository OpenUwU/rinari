import type { TableSchema, QueryOptions, IndexOptions } from './orm.js';

/**
 * Driver configuration options.
 *
 * @remarks
 * Configuration varies by driver type. Check your driver's documentation
 * for supported options and requirements.
 *
 * @example
 * SQLite driver configuration:
 * ```typescript
 * import { DriverConfig } from '@rinari/types';
 *
 * const config: DriverConfig = {
 *   storageDir: './data',
 *   verbose: false,
 *   readonly: false
 * };
 * ```
 *
 * @public
 */
export interface DriverConfig {
  /**
   * Named database connections (driver-specific).
   * Maps database names to connection strings or file paths.
   */
  databases?: Record<string, string>;

  /**
   * Primary connection URL.
   */
  url?: string;

  /**
   * Connection string for database access.
   */
  connectionString?: string;

  /**
   * Driver-specific options.
   */
  options?: Record<string, any>;

  /**
   * Enable verbose logging of database operations.
   * @defaultValue false
   */
  verbose?: boolean;

  /**
   * Open database in read-only mode.
   * @defaultValue false
   */
  readonly?: boolean;

  /**
   * Directory for storing database files.
   * Required for file-based drivers like SQLite.
   */
  storageDir: string;
}

/**
 * Driver metadata and identification.
 *
 * @remarks
 * Provides information about the driver implementation.
 *
 * @example
 * ```typescript
 * console.log(driver.metadata.name);    // "sqlite"
 * console.log(driver.metadata.version); // "1.0.0"
 * ```
 *
 * @public
 */
export interface DriverMetadata {
  /**
   * Driver name identifier.
   * @example "sqlite", "mongodb", "json"
   */
  name: string;

  /**
   * Driver version string.
   */
  version: string;
}

/**
 * Base driver interface supporting both synchronous and asynchronous operations.
 *
 * @remarks
 * All drivers must implement this interface. Methods may return values directly
 * (synchronous) or wrapped in Promises (asynchronous) depending on the driver type.
 *
 * Use {@link SyncDriver} or {@link AsyncDriver} for type-specific implementations.
 *
 * @example
 * Creating a custom driver:
 * ```typescript
 * import { Driver, DriverConfig, DriverMetadata } from '@rinari/types';
 *
 * class MyDriver implements Driver {
 *   readonly metadata: DriverMetadata = {
 *     name: 'my-driver',
 *     version: '1.0.0'
 *   };
 *
 *   connect(config: DriverConfig): void {
 *     // Connection logic
 *   }
 *
 *   // ... implement other methods
 * }
 * ```
 *
 * @public
 */
export interface Driver {
  /**
   * Driver metadata (name, version).
   */
  readonly metadata: DriverMetadata;

  /**
   * Establish database connection.
   *
   * @param config - Driver configuration
   *
   * @example
   * ```typescript
   * driver.connect({
   *   storageDir: './data',
   *   verbose: true
   * });
   * ```
   */
  connect(config: DriverConfig): Promise<void> | void;

  /**
   * Close database connection and cleanup resources.
   *
   * @example
   * ```typescript
   * await driver.disconnect();
   * ```
   */
  disconnect(): Promise<void> | void;

  /**
   * Create a new table with the specified schema.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param schema - Table schema definition
   *
   * @example
   * ```typescript
   * driver.createTable('main', 'users', {
   *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   *   username: { type: DataTypes.TEXT, notNull: true, unique: true }
   * });
   * ```
   */
  createTable(dbName: string, tableName: string, schema: TableSchema): Promise<void> | void;

  /**
   * Drop (delete) a table.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   *
   * @example
   * ```typescript
   * driver.dropTable('main', 'old_users');
   * ```
   */
  dropTable(dbName: string, tableName: string): Promise<void> | void;

  /**
   * Check if a table exists.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @returns True if table exists, false otherwise
   *
   * @example
   * ```typescript
   * if (driver.tableExists('main', 'users')) {
   *   console.log('Users table exists');
   * }
   * ```
   */
  tableExists(dbName: string, tableName: string): Promise<boolean> | boolean;

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
   * const user = driver.findOne<User>('main', 'users', {
   *   where: { username: 'alice' }
   * });
   * ```
   */
  findOne<T = any>(
    dbName: string,
    tableName: string,
    options: QueryOptions
  ): Promise<T | null> | T | null;

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
   * const adults = driver.findAll<User>('main', 'users', {
   *   where: { age: { $gte: 18 } },
   *   orderBy: [['age', 'ASC']],
   *   limit: 10
   * });
   * ```
   */
  findAll<T = any>(dbName: string, tableName: string, options: QueryOptions): Promise<T[]> | T[];

  /**
   * Count records matching the where condition.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param where - Filter conditions
   * @returns Number of matching records
   *
   * @example
   * ```typescript
   * const count = driver.count('main', 'users', {
   *   status: 'active'
   * });
   * console.log(`${count} active users`);
   * ```
   */
  count(dbName: string, tableName: string, where?: Record<string, any>): Promise<number> | number;

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
   * const user = driver.insert<User>('main', 'users', {
   *   username: 'alice',
   *   email: 'alice@example.com',
   *   age: 25
   * });
   * console.log(user.id); // Generated ID
   * ```
   */
  insert<T = any>(dbName: string, tableName: string, data: Record<string, any>): Promise<T> | T;

  /**
   * Insert multiple records in a single operation.
   *
   * @typeParam T - Expected return type
   * @param dbName - Database name
   * @param tableName - Table name
   * @param records - Array of records to insert
   * @returns Array of inserted records with generated IDs
   *
   * @example
   * ```typescript
   * const users = driver.bulkInsert<User>('main', 'users', [
   *   { username: 'alice', email: 'alice@example.com' },
   *   { username: 'bob', email: 'bob@example.com' }
   * ]);
   * ```
   */
  bulkInsert<T = any>(
    dbName: string,
    tableName: string,
    records: Record<string, any>[]
  ): Promise<T[]> | T[];

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
   * const updated = driver.update('main', 'users',
   *   { status: 'inactive' },
   *   { last_login: { $lt: '2024-01-01' } }
   * );
   * console.log(`${updated} users deactivated`);
   * ```
   */
  update(
    dbName: string,
    tableName: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<number> | number;

  /**
   * Perform multiple updates in a single operation.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param updates - Array of update operations
   * @returns Total number of updated records
   *
   * @example
   * ```typescript
   * const updated = driver.bulkUpdate('main', 'users', [
   *   { where: { id: 1 }, data: { status: 'active' } },
   *   { where: { id: 2 }, data: { status: 'inactive' } }
   * ]);
   * ```
   */
  bulkUpdate(
    dbName: string,
    tableName: string,
    updates: Array<{ where: Record<string, any>; data: Record<string, any> }>
  ): Promise<number> | number;

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
   * const deleted = driver.delete('main', 'users', {
   *   status: 'banned'
   * });
   * console.log(`${deleted} users removed`);
   * ```
   */
  delete(dbName: string, tableName: string, where: Record<string, any>): Promise<number> | number;

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
   * driver.createIndex('main', 'users', 'idx_email', {
   *   unique: true,
   *   columns: ['email']
   * });
   * ```
   */
  createIndex(
    dbName: string,
    tableName: string,
    indexName: string,
    options: IndexOptions
  ): Promise<void> | void;

  /**
   * Drop (delete) an index.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param indexName - Index name
   *
   * @example
   * ```typescript
   * driver.dropIndex('main', 'users', 'idx_email');
   * ```
   */
  dropIndex(dbName: string, tableName: string, indexName: string): Promise<void> | void;

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
   *   const user = driver.insert('main', 'users', { username: 'alice' });
   *   driver.insert('main', 'profiles', { user_id: user.id, bio: 'Hello' });
   *   return user;
   * });
   * ```
   */
  transaction<T>(fn: () => T | Promise<T>): Promise<T> | T;

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
   * const totalAge = driver.aggregate('main', 'users', 'SUM', 'age');
   * const avgAge = driver.aggregate('main', 'users', 'AVG', 'age', {
   *   status: 'active'
   * });
   * ```
   */
  aggregate?(
    dbName: string,
    tableName: string,
    operation: string,
    field: string,
    where?: Record<string, any>
  ): Promise<number> | number;
}

/**
 * Synchronous driver interface.
 *
 * @remarks
 * All operations return values directly without Promises.
 * Suitable for SQLite and other synchronous backends.
 *
 * @example
 * ```typescript
 * import { SyncDriver } from '@rinari/types';
 *
 * const driver: SyncDriver = new SQLiteDriver(config);
 * const user = driver.findOne('main', 'users', { where: { id: 1 } });
 * console.log(user); // No await needed
 * ```
 *
 * @public
 */
export interface SyncDriver extends Driver {
  connect(config: DriverConfig): void;
  disconnect(): void;
  createTable(dbName: string, tableName: string, schema: TableSchema): void;
  dropTable(dbName: string, tableName: string): void;
  tableExists(dbName: string, tableName: string): boolean;
  findOne<T = any>(dbName: string, tableName: string, options: QueryOptions): T | null;
  findAll<T = any>(dbName: string, tableName: string, options: QueryOptions): T[];
  count(dbName: string, tableName: string, where?: Record<string, any>): number;
  insert<T = any>(dbName: string, tableName: string, data: Record<string, any>): T;
  bulkInsert<T = any>(dbName: string, tableName: string, records: Record<string, any>[]): T[];
  update(
    dbName: string,
    tableName: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): number;
  bulkUpdate(
    dbName: string,
    tableName: string,
    updates: Array<{ where: Record<string, any>; data: Record<string, any> }>
  ): number;
  delete(dbName: string, tableName: string, where: Record<string, any>): number;
  createIndex(dbName: string, tableName: string, indexName: string, options: IndexOptions): void;
  dropIndex(dbName: string, tableName: string, indexName: string): void;
  transaction<T>(fn: () => T): T;
}

/**
 * Asynchronous driver interface.
 *
 * @remarks
 * All operations return Promises.
 * Suitable for MongoDB and other asynchronous backends.
 *
 * @example
 * ```typescript
 * import { AsyncDriver } from '@rinari/types';
 *
 * const driver: AsyncDriver = new MongoDriver(config);
 * const user = await driver.findOne('main', 'users', { where: { id: 1 } });
 * console.log(user); // Must await
 * ```
 *
 * @public
 */
export interface AsyncDriver extends Driver {
  connect(config: DriverConfig): Promise<void>;
  disconnect(): Promise<void>;
  createTable(dbName: string, tableName: string, schema: TableSchema): Promise<void>;
  dropTable(dbName: string, tableName: string): Promise<void>;
  tableExists(dbName: string, tableName: string): Promise<boolean>;
  findOne<T = any>(dbName: string, tableName: string, options: QueryOptions): Promise<T | null>;
  findAll<T = any>(dbName: string, tableName: string, options: QueryOptions): Promise<T[]>;
  count(dbName: string, tableName: string, where?: Record<string, any>): Promise<number>;
  insert<T = any>(dbName: string, tableName: string, data: Record<string, any>): Promise<T>;
  bulkInsert<T = any>(
    dbName: string,
    tableName: string,
    records: Record<string, any>[]
  ): Promise<T[]>;
  update(
    dbName: string,
    tableName: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<number>;
  bulkUpdate(
    dbName: string,
    tableName: string,
    updates: Array<{ where: Record<string, any>; data: Record<string, any> }>
  ): Promise<number>;
  delete(dbName: string, tableName: string, where: Record<string, any>): Promise<number>;
  createIndex(
    dbName: string,
    tableName: string,
    indexName: string,
    options: IndexOptions
  ): Promise<void>;
  dropIndex(dbName: string, tableName: string, indexName: string): Promise<void>;
  transaction<T>(fn: () => Promise<T>): Promise<T>;
}
