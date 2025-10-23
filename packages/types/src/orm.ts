/**
 * Data type identifier for column definitions.
 *
 * @remarks
 * Supported types include text, numeric, date/time, and structured data types.
 * Drivers map these to their native equivalents (e.g., TEXT → VARCHAR, JSON → TEXT).
 *
 * @public
 */
export type DataType =
  | 'TEXT'
  | 'STRING'
  | 'INTEGER'
  | 'NUMBER'
  | 'REAL'
  | 'BLOB'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATETIME'
  | 'JSON'
  | 'OBJECT'
  | 'ARRAY';

/**
 * Column definition for table schema.
 *
 * @remarks
 * Defines the structure, constraints, and relationships for a single column.
 * Use this to specify column properties when creating models.
 *
 * @example
 * ```typescript
 * import { ColumnDefinition, DataTypes } from '@rinari/types';
 *
 * const idColumn: ColumnDefinition = {
 *   type: DataTypes.INTEGER,
 *   primaryKey: true,
 *   autoIncrement: true
 * };
 *
 * const emailColumn: ColumnDefinition = {
 *   type: DataTypes.TEXT,
 *   notNull: true,
 *   unique: true
 * };
 *
 * const foreignKeyColumn: ColumnDefinition = {
 *   type: DataTypes.INTEGER,
 *   references: {
 *     table: 'users',
 *     column: 'id',
 *     onDelete: 'CASCADE'
 *   }
 * };
 * ```
 *
 * @public
 */
export interface ColumnDefinition {
  /**
   * The data type of the column.
   */
  type: DataType;

  /**
   * Whether this column is the primary key.
   * @defaultValue false
   */
  primaryKey?: boolean;

  /**
   * Whether this column auto-increments (requires INTEGER type and primaryKey).
   * @defaultValue false
   */
  autoIncrement?: boolean;

  /**
   * Whether this column cannot contain NULL values.
   * @defaultValue false
   */
  notNull?: boolean;

  /**
   * Whether values in this column must be unique.
   * @defaultValue false
   */
  unique?: boolean;

  /**
   * Default value for this column.
   * Type should match the column's data type.
   */
  default?: any;

  /**
   * Foreign key reference configuration.
   *
   * @example
   * ```typescript
   * references: {
   *   table: 'users',
   *   column: 'id',
   *   onDelete: 'CASCADE',
   *   onUpdate: 'CASCADE'
   * }
   * ```
   */
  references?: {
    table: string;
    column: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  };
}

/**
 * Table schema definition mapping column names to their definitions.
 *
 * @remarks
 * A table schema is a key-value object where keys are column names
 * and values are {@link ColumnDefinition} objects.
 *
 * @example
 * ```typescript
 * import { TableSchema, DataTypes } from '@rinari/types';
 *
 * const userSchema: TableSchema = {
 *   id: {
 *     type: DataTypes.INTEGER,
 *     primaryKey: true,
 *     autoIncrement: true
 *   },
 *   username: {
 *     type: DataTypes.TEXT,
 *     notNull: true,
 *     unique: true
 *   },
 *   email: {
 *     type: DataTypes.TEXT,
 *     notNull: true,
 *     unique: true
 *   },
 *   age: {
 *     type: DataTypes.INTEGER
 *   },
 *   isActive: {
 *     type: DataTypes.BOOLEAN,
 *     default: true
 *   },
 *   metadata: {
 *     type: DataTypes.JSON
 *   }
 * };
 * ```
 *
 * @public
 */
export interface TableSchema {
  [columnName: string]: ColumnDefinition;
}

/**
 * Query options for finding and filtering records.
 *
 * @remarks
 * Controls filtering, sorting, pagination, and field selection for queries.
 * All properties are optional - omitting them returns all records.
 *
 * @example
 * Basic filtering:
 * ```typescript
 * const options: QueryOptions = {
 *   where: { age: 25, isActive: true }
 * };
 * ```
 *
 * @example
 * Advanced query with operators:
 * ```typescript
 * const options: QueryOptions = {
 *   where: {
 *     age: { $gte: 18, $lt: 65 },
 *     username: { $like: '%john%' }
 *   },
 *   orderBy: [['created_at', 'DESC']],
 *   limit: 10,
 *   offset: 0,
 *   select: ['id', 'username', 'email']
 * };
 * ```
 *
 * @public
 */
export interface QueryOptions {
  /**
   * Filter conditions. Supports both direct values and operator objects.
   *
   * @example
   * ```typescript
   * where: { id: 1 }
   * where: { age: { $gte: 18 }, status: 'active' }
   * ```
   */
  where?: Record<string, any>;

  /**
   * Sort order as array of [column, direction] tuples.
   *
   * @example
   * ```typescript
   * orderBy: [['created_at', 'DESC'], ['username', 'ASC']]
   * ```
   */
  orderBy?: Array<[string, 'ASC' | 'DESC']>;

  /**
   * Maximum number of records to return.
   */
  limit?: number;

  /**
   * Number of records to skip (for pagination).
   */
  offset?: number;

  /**
   * Specific columns to select (omit for all columns).
   *
   * @example
   * ```typescript
   * select: ['id', 'username', 'email']
   * ```
   */
  select?: string[];
}

/**
 * Bulk update operation specification.
 *
 * @remarks
 * Used for performing multiple updates in a single transaction.
 *
 * @example
 * ```typescript
 * const updates: BulkUpdateOptions[] = [
 *   { where: { id: 1 }, values: { status: 'active' } },
 *   { where: { id: 2 }, values: { status: 'inactive' } }
 * ];
 * ```
 *
 * @public
 */
export interface BulkUpdateOptions {
  /**
   * Conditions to match records for update.
   */
  where: Record<string, any>;

  /**
   * New values to apply.
   */
  values: Record<string, any>;
}

/**
 * Transaction callback function type.
 *
 * @typeParam T - The return type of the transaction
 *
 * @remarks
 * Transactions execute all operations atomically - either all succeed or all fail.
 *
 * @example
 * ```typescript
 * const callback: TransactionCallback<User> = () => {
 *   const user = userModel.create({ username: 'alice' });
 *   profileModel.create({ userId: user.id, bio: 'Hello' });
 *   return user;
 * };
 * ```
 *
 * @public
 */
export interface TransactionCallback<T> {
  (): T | Promise<T>;
}

/**
 * Index creation options.
 *
 * @remarks
 * Indexes improve query performance on frequently searched columns.
 *
 * @example
 * Standard index:
 * ```typescript
 * const indexOptions: IndexOptions = {
 *   columns: ['email']
 * };
 * ```
 *
 * @example
 * Unique composite index:
 * ```typescript
 * const indexOptions: IndexOptions = {
 *   unique: true,
 *   columns: ['user_id', 'post_id']
 * };
 * ```
 *
 * @example
 * Partial index:
 * ```typescript
 * const indexOptions: IndexOptions = {
 *   columns: ['status'],
 *   where: "status = 'active'"
 * };
 * ```
 *
 * @public
 */
export interface IndexOptions {
  /**
   * Whether the index enforces uniqueness.
   * @defaultValue false
   */
  unique?: boolean;

  /**
   * Columns to include in the index.
   */
  columns: string[];

  /**
   * Optional WHERE clause for partial indexes.
   */
  where?: string;
}

/**
 * Valid value types for WHERE conditions.
 *
 * @public
 */
export type WhereValue = string | number | boolean | null | Date;

/**
 * Query operators for advanced WHERE conditions.
 *
 * @remarks
 * Use these operators for complex filtering beyond simple equality.
 *
 * @example
 * ```typescript
 * const condition: WhereOperators = {
 *   $gte: 18,
 *   $lt: 65
 * };
 *
 * where: { age: condition }
 * ```
 *
 * @public
 */
export interface WhereOperators {
  /**
   * Greater than.
   * @example `{ age: { $gt: 17 } }`
   */
  $gt?: WhereValue;

  /**
   * Greater than or equal to.
   * @example `{ age: { $gte: 18 } }`
   */
  $gte?: WhereValue;

  /**
   * Less than.
   * @example `{ age: { $lt: 65 } }`
   */
  $lt?: WhereValue;

  /**
   * Less than or equal to.
   * @example `{ age: { $lte: 64 } }`
   */
  $lte?: WhereValue;

  /**
   * Not equal to.
   * @example `{ status: { $ne: 'banned' } }`
   */
  $ne?: WhereValue;

  /**
   * Value is in the array.
   * @example `{ role: { $in: ['admin', 'moderator'] } }`
   */
  $in?: WhereValue[];

  /**
   * Value is not in the array.
   * @example `{ status: { $notIn: ['banned', 'suspended'] } }`
   */
  $notIn?: WhereValue[];

  /**
   * Pattern matching with wildcards.
   * @example `{ username: { $like: '%john%' } }`
   */
  $like?: string;

  /**
   * Value is between two values (inclusive).
   * @example `{ age: { $between: [18, 65] } }`
   */
  $between?: [WhereValue, WhereValue];
}

/**
 * WHERE condition - either a direct value or operators object.
 *
 * @public
 */
export type WhereCondition = WhereValue | WhereOperators;

/**
 * Aggregation options for GROUP BY and HAVING clauses.
 *
 * @remarks
 * Used with aggregate functions like COUNT, SUM, AVG, etc.
 *
 * @example
 * ```typescript
 * const options: AggregateOptions = {
 *   groupBy: ['category'],
 *   having: { count: { $gt: 5 } }
 * };
 * ```
 *
 * @public
 */
export interface AggregateOptions {
  /**
   * Columns to group results by.
   */
  groupBy?: string[];

  /**
   * Filter conditions applied after grouping.
   */
  having?: Record<string, any>;
}
