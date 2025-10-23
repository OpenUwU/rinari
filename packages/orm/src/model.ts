import type { Driver, TableSchema, QueryOptions, IndexOptions } from '@rinari/types';

/**
 * Model class representing a database table with CRUD operations.
 *
 * @typeParam T - The type of records in this table
 *
 * @remarks
 * Models provide an object-oriented interface for interacting with database tables.
 * Each model instance corresponds to a specific table in a specific database.
 *
 * Models are created via {@link ORM.define} and should not be instantiated directly.
 *
 * @example
 * Create and use a model:
 * ```typescript
 * import { ORM } from '@rinari/orm';
 * import { SQLiteDriver } from '@rinari/sqlite';
 * import { DataTypes } from '@rinari/types';
 *
 * interface User {
 *   id: number;
 *   username: string;
 *   email: string;
 *   age: number;
 * }
 *
 * const orm = new ORM({
 *   driver: new SQLiteDriver({ storageDir: './data' })
 * });
 *
 * const User = orm.define<User>('default', 'users', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *   username: { type: DataTypes.TEXT, notNull: true, unique: true },
 *   email: { type: DataTypes.TEXT, notNull: true, unique: true },
 *   age: { type: DataTypes.INTEGER }
 * });
 *
 * const newUser = User.create({
 *   username: 'alice',
 *   email: 'alice@example.com',
 *   age: 25
 * });
 *
 * const users = User.findAll({ where: { age: { $gte: 18 } } });
 * const count = User.count({ isActive: true });
 *
 * User.update({ age: 26 }, { id: newUser.id });
 * User.delete({ id: newUser.id });
 * ```
 *
 * @public
 */
export class Model<T = any> {
  protected tableName: string;
  protected dbName: string;
  protected schema: TableSchema;
  protected driver: Driver;

  /**
   * @internal
   * Creates a new Model instance.
   *
   * @remarks
   * Models should be created using {@link ORM.define}, not directly instantiated.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @param schema - Table schema definition
   * @param driver - Database driver instance
   */
  constructor(dbName: string, tableName: string, schema: TableSchema, driver: Driver) {
    this.dbName = dbName;
    this.tableName = tableName;
    this.schema = schema;
    this.driver = driver;

    this.ensureTable();
  }

  /**
   * @internal
   * Ensures the table exists, creating it if necessary.
   */
  private ensureTable(): void {
    const exists = this.driver.tableExists(this.dbName, this.tableName);
    if (typeof exists === 'boolean' ? !exists : false) {
      this.driver.createTable(this.dbName, this.tableName, this.schema);
    } else if (exists instanceof Promise) {
      exists.then((e) => {
        if (!e) {
          this.driver.createTable(this.dbName, this.tableName, this.schema);
        }
      });
    }
  }

  /**
   * Find a single record matching the query options.
   *
   * @param options - Query options (where, select, etc.)
   * @returns Matching record or null
   *
   * @example
   * Simple query:
   * ```typescript
   * const user = User.findOne({ where: { username: 'alice' } });
   * ```
   *
   * @example
   * With field selection:
   * ```typescript
   * const user = User.findOne({
   *   where: { id: 1 },
   *   select: ['id', 'username', 'email']
   * });
   * ```
   *
   * @example
   * With operators:
   * ```typescript
   * const adult = User.findOne({
   *   where: { age: { $gte: 18 } }
   * });
   * ```
   */
  findOne(options: QueryOptions = {}): T | null | Promise<T | null> {
    return this.driver.findOne<T>(this.dbName, this.tableName, options);
  }

  /**
   * Find all records matching the query options.
   *
   * @param options - Query options (where, orderBy, limit, etc.)
   * @returns Array of matching records
   *
   * @example
   * Find all records:
   * ```typescript
   * const allUsers = User.findAll();
   * ```
   *
   * @example
   * With filtering and sorting:
   * ```typescript
   * const activeUsers = User.findAll({
   *   where: { isActive: true },
   *   orderBy: [['created_at', 'DESC']],
   *   limit: 10,
   *   offset: 0
   * });
   * ```
   *
   * @example
   * With complex conditions:
   * ```typescript
   * const users = User.findAll({
   *   where: {
   *     age: { $gte: 18, $lt: 65 },
   *     role: { $in: ['admin', 'moderator'] }
   *   },
   *   select: ['id', 'username', 'role']
   * });
   * ```
   */
  findAll(options: QueryOptions = {}): T[] | Promise<T[]> {
    return this.driver.findAll<T>(this.dbName, this.tableName, options);
  }

  /**
   * Find a single record by its primary key (id).
   *
   * @param id - Primary key value
   * @returns Matching record or null
   *
   * @example
   * ```typescript
   * const user = User.findById(1);
   * if (user) {
   *   console.log(user.username);
   * }
   * ```
   */
  findById(id: number | string): T | null | Promise<T | null> {
    return this.findOne({ where: { id } });
  }

  /**
   * Count records matching the where condition.
   *
   * @param where - Filter conditions (optional)
   * @returns Number of matching records
   *
   * @example
   * Count all records:
   * ```typescript
   * const totalUsers = User.count();
   * ```
   *
   * @example
   * Count with condition:
   * ```typescript
   * const activeUsers = User.count({ isActive: true });
   * const adults = User.count({ age: { $gte: 18 } });
   * ```
   */
  count(where?: Record<string, any>): number | Promise<number> {
    return this.driver.count(this.dbName, this.tableName, where);
  }

  /**
   * Create and insert a new record.
   *
   * @param data - Record data
   * @returns Created record with generated ID
   *
   * @example
   * ```typescript
   * const user = User.create({
   *   username: 'alice',
   *   email: 'alice@example.com',
   *   age: 25
   * });
   * console.log(`Created user with ID: ${user.id}`);
   * ```
   */
  create(data: Partial<T>): T | Promise<T> {
    return this.driver.insert<T>(this.dbName, this.tableName, data as Record<string, any>);
  }

  /**
   * Insert multiple records in a single operation.
   *
   * @param records - Array of records to insert
   * @returns Array of created records with generated IDs
   *
   * @remarks
   * This is more efficient than calling {@link create} multiple times.
   * All inserts are performed within a transaction for atomicity.
   *
   * @example
   * ```typescript
   * const users = User.bulkCreate([
   *   { username: 'alice', email: 'alice@example.com' },
   *   { username: 'bob', email: 'bob@example.com' },
   *   { username: 'charlie', email: 'charlie@example.com' }
   * ]);
   * console.log(`Created ${users.length} users`);
   * ```
   */
  bulkCreate(records: Array<Partial<T>>): T[] | Promise<T[]> {
    return this.driver.bulkInsert<T>(this.dbName, this.tableName, records as Record<string, any>[]);
  }

  /**
   * Update records matching the where condition.
   *
   * @param data - New values to set
   * @param where - Filter conditions
   * @returns Number of updated records
   *
   * @example
   * Update by ID:
   * ```typescript
   * const updated = User.update(
   *   { age: 26, status: 'active' },
   *   { id: 1 }
   * );
   * console.log(`${updated} records updated`);
   * ```
   *
   * @example
   * Update multiple records:
   * ```typescript
   * const updated = User.update(
   *   { isVerified: true },
   *   { email: { $like: '%@example.com' } }
   * );
   * ```
   */
  update(data: Partial<T>, where: Record<string, any>): number | Promise<number> {
    return this.driver.update(this.dbName, this.tableName, data as Record<string, any>, where);
  }

  /**
   * Perform multiple different updates in a single transaction.
   *
   * @param updates - Array of update operations
   * @returns Total number of updated records
   *
   * @example
   * ```typescript
   * const updated = User.bulkUpdate([
   *   { where: { id: 1 }, data: { status: 'active' } },
   *   { where: { id: 2 }, data: { status: 'inactive' } },
   *   { where: { id: 3 }, data: { status: 'banned' } }
   * ]);
   * console.log(`${updated} records updated`);
   * ```
   */
  bulkUpdate(
    updates: Array<{ where: Record<string, any>; data: Partial<T> }>
  ): number | Promise<number> {
    const mapped = updates.map((u) => ({
      where: u.where,
      data: u.data as Record<string, any>,
    }));
    return this.driver.bulkUpdate(this.dbName, this.tableName, mapped);
  }

  /**
   * Delete records matching the where condition.
   *
   * @param where - Filter conditions
   * @returns Number of deleted records
   *
   * @example
   * Delete by ID:
   * ```typescript
   * const deleted = User.delete({ id: 1 });
   * console.log(`${deleted} records deleted`);
   * ```
   *
   * @example
   * Delete with condition:
   * ```typescript
   * const deleted = User.delete({
   *   status: 'banned',
   *   last_login: { $lt: '2024-01-01' }
   * });
   * ```
   */
  delete(where: Record<string, any>): number | Promise<number> {
    return this.driver.delete(this.dbName, this.tableName, where);
  }

  /**
   * Delete multiple sets of records in a single transaction.
   *
   * @param whereConditions - Array of filter conditions
   * @returns Total number of deleted records
   *
   * @example
   * ```typescript
   * const deleted = User.bulkDelete([
   *   { status: 'banned' },
   *   { last_login: { $lt: '2023-01-01' } },
   *   { is_deleted: true }
   * ]);
   * console.log(`${deleted} records deleted`);
   * ```
   */
  bulkDelete(whereConditions: Array<Record<string, any>>): number | Promise<number> {
    if (this.driver.transaction) {
      return this.driver.transaction(() => {
        let total = 0;
        for (const where of whereConditions) {
          const result = this.delete(where);
          if (typeof result === 'number') {
            total += result;
          }
        }
        return total;
      });
    }

    let total = 0;
    for (const where of whereConditions) {
      const result = this.delete(where);
      if (typeof result === 'number') {
        total += result;
      }
    }
    return total;
  }

  /**
   * Create an index on specified columns.
   *
   * @param indexName - Name for the index
   * @param options - Index options (columns, unique, etc.)
   *
   * @example
   * Simple index:
   * ```typescript
   * User.createIndex('idx_email', {
   *   columns: ['email']
   * });
   * ```
   *
   * @example
   * Unique composite index:
   * ```typescript
   * User.createIndex('idx_username_email', {
   *   unique: true,
   *   columns: ['username', 'email']
   * });
   * ```
   *
   * @example
   * Partial index:
   * ```typescript
   * User.createIndex('idx_active_users', {
   *   columns: ['created_at'],
   *   where: "status = 'active'"
   * });
   * ```
   */
  createIndex(indexName: string, options: IndexOptions): void | Promise<void> {
    return this.driver.createIndex(this.dbName, this.tableName, indexName, options);
  }

  /**
   * Drop (delete) an index.
   *
   * @param indexName - Name of the index to drop
   *
   * @example
   * ```typescript
   * User.dropIndex('idx_email');
   * ```
   */
  dropIndex(indexName: string): void | Promise<void> {
    return this.driver.dropIndex(this.dbName, this.tableName, indexName);
  }

  /**
   * Perform an aggregation operation.
   *
   * @param operation - Aggregation type (SUM, AVG, MIN, MAX, COUNT)
   * @param field - Field to aggregate
   * @param where - Optional filter conditions
   * @returns Aggregation result
   *
   * @throws {Error} If driver doesn't support aggregation
   *
   * @example
   * ```typescript
   * const totalAge = User.aggregate('SUM', 'age');
   * const avgAge = User.aggregate('AVG', 'age', { status: 'active' });
   * const maxAge = User.aggregate('MAX', 'age');
   * ```
   */
  aggregate(
    operation: string,
    field: string,
    where?: Record<string, any>
  ): number | Promise<number> {
    if (!this.driver.aggregate) {
      throw new Error('Driver does not support aggregation');
    }
    return this.driver.aggregate(this.dbName, this.tableName, operation, field, where);
  }

  /**
   * Calculate sum of a numeric field.
   *
   * @param field - Field name
   * @param where - Optional filter conditions
   * @returns Sum of field values
   *
   * @example
   * ```typescript
   * const totalRevenue = Order.sum('amount');
   * const todayRevenue = Order.sum('amount', {
   *   created_at: { $gte: '2024-10-20' }
   * });
   * ```
   */
  sum(field: string, where?: Record<string, any>): number | Promise<number> {
    return this.aggregate('SUM', field, where);
  }

  /**
   * Calculate average of a numeric field.
   *
   * @param field - Field name
   * @param where - Optional filter conditions
   * @returns Average of field values
   *
   * @example
   * ```typescript
   * const avgAge = User.avg('age');
   * const avgActiveAge = User.avg('age', { isActive: true });
   * ```
   */
  avg(field: string, where?: Record<string, any>): number | Promise<number> {
    return this.aggregate('AVG', field, where);
  }

  /**
   * Find minimum value of a field.
   *
   * @param field - Field name
   * @param where - Optional filter conditions
   * @returns Minimum field value
   *
   * @example
   * ```typescript
   * const minAge = User.min('age');
   * const minPrice = Product.min('price', { category: 'electronics' });
   * ```
   */
  min(field: string, where?: Record<string, any>): number | Promise<number> {
    return this.aggregate('MIN', field, where);
  }

  /**
   * Find maximum value of a field.
   *
   * @param field - Field name
   * @param where - Optional filter conditions
   * @returns Maximum field value
   *
   * @example
   * ```typescript
   * const maxAge = User.max('age');
   * const maxPrice = Product.max('price', { category: 'electronics' });
   * ```
   */
  max(field: string, where?: Record<string, any>): number | Promise<number> {
    return this.aggregate('MAX', field, where);
  }

  /**
   * Execute a transaction.
   *
   * @typeParam R - Transaction return type
   * @param fn - Transaction callback
   * @returns Transaction result
   *
   * @remarks
   * All operations within the callback execute atomically.
   * If an error occurs, all changes are rolled back.
   *
   * @example
   * ```typescript
   * const result = User.transaction(() => {
   *   const user = User.create({ username: 'alice' });
   *   Profile.create({ userId: user.id, bio: 'Hello' });
   *   return user;
   * });
   * ```
   *
   * @example
   * Error handling:
   * ```typescript
   * try {
   *   User.transaction(() => {
   *     User.create({ username: 'alice' });
   *     throw new Error('Rollback!');
   *   });
   * } catch (error) {
   *   console.log('Transaction rolled back');
   * }
   * ```
   */
  transaction<R>(fn: () => R | Promise<R>): R | Promise<R> {
    return this.driver.transaction(fn);
  }

  /**
   * Get the table name.
   *
   * @example
   * ```typescript
   * console.log(User.table); // "users"
   * ```
   */
  get table(): string {
    return this.tableName;
  }

  /**
   * Get the database name.
   *
   * @example
   * ```typescript
   * console.log(User.database); // "default"
   * ```
   */
  get database(): string {
    return this.dbName;
  }
}
