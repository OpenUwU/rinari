import type { Connection } from './connection.js';
import type { TableSchema, ColumnDefinition, IndexOptions, DataType } from '@rinari/types';

/**
 * Schema manager for creating and managing SQLite tables and indexes.
 *
 * @remarks
 * Handles DDL (Data Definition Language) operations including table creation,
 * index management, and schema introspection. Automatically maps Rinari
 * data types to SQLite types.
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { Connection, SchemaManager } from '@rinari/sqlite';
 * import { DataTypes } from '@rinari/types';
 *
 * const conn = new Connection({ filepath: './data/app.db' });
 * const schema = new SchemaManager(conn);
 *
 * schema.createTable('users', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *   username: { type: DataTypes.TEXT, notNull: true, unique: true },
 *   email: { type: DataTypes.TEXT, notNull: true, unique: true }
 * });
 *
 * schema.createIndex('users', 'idx_email', {
 *   unique: true,
 *   columns: ['email']
 * });
 * ```
 *
 * @public
 */
export class SchemaManager {
  /**
   * Creates a new schema manager.
   *
   * @param connection - Database connection instance
   *
   * @example
   * ```typescript
   * const conn = new Connection({ filepath: './data/app.db' });
   * const schema = new SchemaManager(conn);
   * ```
   */
  constructor(private connection: Connection) {}

  /**
   * @internal
   * Map Rinari data type to SQLite type with constraints.
   *
   * @param type - Rinari data type
   * @param options - Column definition options
   * @returns SQL type definition string
   */
  private mapTypeToSQL(type: DataType, options: ColumnDefinition): string {
    let sql = '';

    switch (type) {
      case 'TEXT':
      case 'STRING':
        sql = 'TEXT';
        break;
      case 'INTEGER':
      case 'NUMBER':
        sql = 'INTEGER';
        break;
      case 'REAL':
        sql = 'REAL';
        break;
      case 'BLOB':
        sql = 'BLOB';
        break;
      case 'BOOLEAN':
        sql = 'INTEGER';
        break;
      case 'DATE':
      case 'DATETIME':
        sql = 'TEXT';
        break;
      case 'JSON':
      case 'OBJECT':
      case 'ARRAY':
        sql = 'TEXT';
        break;
      default:
        sql = 'TEXT';
    }

    if (options.primaryKey) {
      sql += ' PRIMARY KEY';
      if (options.autoIncrement) {
        sql += ' AUTOINCREMENT';
      }
    }

    if (options.notNull && !options.primaryKey) {
      sql += ' NOT NULL';
    }

    if (options.unique && !options.primaryKey) {
      sql += ' UNIQUE';
    }

    if (options.default !== undefined) {
      if (typeof options.default === 'string') {
        sql += ` DEFAULT '${options.default.replace(/'/g, "''")}'`;
      } else if (options.default === null) {
        sql += ` DEFAULT NULL`;
      } else if (typeof options.default === 'boolean') {
        sql += ` DEFAULT ${options.default ? 1 : 0}`;
      } else {
        sql += ` DEFAULT ${options.default}`;
      }
    }

    if (options.references) {
      const { table, column, onDelete, onUpdate } = options.references;
      sql += ` REFERENCES ${table}(${column})`;
      if (onDelete) sql += ` ON DELETE ${onDelete}`;
      if (onUpdate) sql += ` ON UPDATE ${onUpdate}`;
    }

    return sql;
  }

  /**
   * Create a new table.
   *
   * @param tableName - Table name
   * @param schema - Table schema definition
   *
   * @remarks
   * Creates the table if it doesn't exist. If the table already exists, this operation is a no-op.
   *
   * @example
   * Simple table:
   * ```typescript
   * schema.createTable('users', {
   *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   *   username: { type: DataTypes.TEXT, notNull: true }
   * });
   * ```
   *
   * @example
   * Table with foreign keys:
   * ```typescript
   * schema.createTable('posts', {
   *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   *   user_id: {
   *     type: DataTypes.INTEGER,
   *     notNull: true,
   *     references: {
   *       table: 'users',
   *       column: 'id',
   *       onDelete: 'CASCADE'
   *     }
   *   },
   *   title: { type: DataTypes.TEXT, notNull: true },
   *   content: { type: DataTypes.TEXT }
   * });
   * ```
   *
   * @example
   * Table with defaults:
   * ```typescript
   * schema.createTable('settings', {
   *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   *   key: { type: DataTypes.TEXT, notNull: true, unique: true },
   *   value: { type: DataTypes.TEXT },
   *   is_active: { type: DataTypes.BOOLEAN, default: true },
   *   created_at: { type: DataTypes.DATETIME }
   * });
   * ```
   */
  createTable(tableName: string, schema: TableSchema): void {
    const columns: string[] = [];

    for (const [columnName, definition] of Object.entries(schema)) {
      const columnDef = `${columnName} ${this.mapTypeToSQL(definition.type, definition)}`;
      columns.push(columnDef);
    }

    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(', ')})`;
    this.connection.exec(sql);
  }

  /**
   * Drop (delete) a table.
   *
   * @param tableName - Table name
   *
   * @remarks
   * Drops the table if it exists. If the table doesn't exist, this operation is a no-op.
   *
   * @example
   * ```typescript
   * schema.dropTable('old_users');
   * ```
   */
  dropTable(tableName: string): void {
    this.connection.exec(`DROP TABLE IF EXISTS ${tableName}`);
  }

  /**
   * Check if a table exists.
   *
   * @param tableName - Table name
   * @returns True if table exists, false otherwise
   *
   * @example
   * ```typescript
   * if (schema.tableExists('users')) {
   *   console.log('Users table exists');
   * } else {
   *   schema.createTable('users', userSchema);
   * }
   * ```
   */
  tableExists(tableName: string): boolean {
    const result = this.connection
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
      .get(tableName);
    return !!result;
  }

  /**
   * Create an index on specified columns.
   *
   * @param tableName - Table name
   * @param indexName - Index name
   * @param options - Index options
   *
   * @remarks
   * Creates the index if it doesn't exist. Indexes improve query performance
   * on frequently searched columns.
   *
   * @example
   * Simple index:
   * ```typescript
   * schema.createIndex('users', 'idx_email', {
   *   columns: ['email']
   * });
   * ```
   *
   * @example
   * Unique index:
   * ```typescript
   * schema.createIndex('users', 'idx_username', {
   *   unique: true,
   *   columns: ['username']
   * });
   * ```
   *
   * @example
   * Composite index:
   * ```typescript
   * schema.createIndex('posts', 'idx_user_date', {
   *   columns: ['user_id', 'created_at']
   * });
   * ```
   *
   * @example
   * Partial index:
   * ```typescript
   * schema.createIndex('users', 'idx_active_users', {
   *   columns: ['created_at'],
   *   where: "status = 'active'"
   * });
   * ```
   */
  createIndex(tableName: string, indexName: string, options: IndexOptions): void {
    const unique = options.unique ? 'UNIQUE' : '';
    const columns = options.columns.join(', ');
    const where = options.where ? ` WHERE ${options.where}` : '';

    const sql = `CREATE ${unique} INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns})${where}`;
    this.connection.exec(sql);
  }

  /**
   * Drop (delete) an index.
   *
   * @param indexName - Index name
   *
   * @remarks
   * Drops the index if it exists. If the index doesn't exist, this operation is a no-op.
   *
   * @example
   * ```typescript
   * schema.dropIndex('idx_email');
   * ```
   */
  dropIndex(indexName: string): void {
    this.connection.exec(`DROP INDEX IF EXISTS ${indexName}`);
  }
}
