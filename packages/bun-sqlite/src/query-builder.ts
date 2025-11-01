import type { Connection } from './connection.js';
import type { QueryOptions, WhereOperators } from '@rinari/types';

/**
 * SQL query builder for Bun SQLite with support for advanced operators.
 *
 * @remarks
 * Builds and executes SQL queries using Bun's native SQLite with automatic
 * parameter binding, value serialization, and comprehensive where clause support.
 * Optimized for Bun's high-performance query engine.
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { Connection, QueryBuilder } from '@rinari/bun-sqlite';
 *
 * const conn = new Connection({ filepath: './data/app.db' });
 * const qb = new QueryBuilder(conn);
 *
 * const users = qb.findAll('users', {
 *   where: { age: { $gte: 18 } },
 *   orderBy: [['username', 'ASC']],
 *   limit: 10
 * });
 * ```
 *
 * @public
 */
export class QueryBuilder {
  /**
   * Creates a new query builder.
   *
   * @param connection - Database connection instance
   *
   * @example
   * ```typescript
   * const conn = new Connection({ filepath: './data/app.db' });
   * const qb = new QueryBuilder(conn);
   * ```
   */
  constructor(private connection: Connection) {}

  /**
   * @internal
   * Serialize a value for database storage.
   *
   * @param value - Value to serialize
   * @returns Serialized value suitable for SQLite
   *
   * @remarks
   * - Objects and arrays are JSON stringified
   * - Dates are converted to ISO strings
   * - Booleans are converted to 0/1
   * - null/undefined becomes null
   */
  private serializeValue(value: any): any {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof Uint8Array)) {
      return JSON.stringify(value);
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value;
  }

  /**
   * @internal
   * Serialize all values in a record.
   */
  private serializeRecord(data: Record<string, any>): Record<string, any> {
    const serialized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = this.serializeValue(value);
    }
    return serialized;
  }

  /**
   * @internal
   * Build SQL WHERE clause from query conditions.
   *
   * @param where - Filter conditions
   * @returns Object with SQL string and parameters array
   */
  private buildWhereClause(where?: Record<string, any>): { sql: string; params: any[] } {
    if (!where || Object.keys(where).length === 0) {
      return { sql: '', params: [] };
    }

    const conditions: string[] = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(where)) {
      if (value === null) {
        conditions.push(`${key} IS NULL`);
      } else if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        value !== null
      ) {
        const condition = value as WhereOperators;

        if ('$gt' in condition && condition.$gt !== undefined) {
          conditions.push(`${key} > ?`);
          params.push(this.serializeValue(condition.$gt));
        }
        if ('$gte' in condition && condition.$gte !== undefined) {
          conditions.push(`${key} >= ?`);
          params.push(this.serializeValue(condition.$gte));
        }
        if ('$lt' in condition && condition.$lt !== undefined) {
          conditions.push(`${key} < ?`);
          params.push(this.serializeValue(condition.$lt));
        }
        if ('$lte' in condition && condition.$lte !== undefined) {
          conditions.push(`${key} <= ?`);
          params.push(this.serializeValue(condition.$lte));
        }
        if ('$ne' in condition && condition.$ne !== undefined) {
          conditions.push(`${key} != ?`);
          params.push(this.serializeValue(condition.$ne));
        }
        if ('$in' in condition && Array.isArray(condition.$in)) {
          const placeholders = condition.$in.map(() => '?').join(', ');
          conditions.push(`${key} IN (${placeholders})`);
          params.push(...condition.$in.map((v: any) => this.serializeValue(v)));
        }
        if ('$notIn' in condition && Array.isArray(condition.$notIn)) {
          const placeholders = condition.$notIn.map(() => '?').join(', ');
          conditions.push(`${key} NOT IN (${placeholders})`);
          params.push(...condition.$notIn.map((v: any) => this.serializeValue(v)));
        }
        if ('$like' in condition && condition.$like !== undefined) {
          conditions.push(`${key} LIKE ?`);
          params.push(this.serializeValue(condition.$like));
        }
        if (
          '$between' in condition &&
          Array.isArray(condition.$between) &&
          condition.$between.length === 2
        ) {
          conditions.push(`${key} BETWEEN ? AND ?`);
          params.push(
            this.serializeValue(condition.$between[0]),
            this.serializeValue(condition.$between[1])
          );
        }
      } else {
        conditions.push(`${key} = ?`);
        params.push(this.serializeValue(value));
      }
    }

    return {
      sql: conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  /**
   * @internal
   * Build SQL ORDER BY clause.
   */
  private buildOrderBy(orderBy?: Array<[string, 'ASC' | 'DESC']>): string {
    if (!orderBy || orderBy.length === 0) return '';

    const orders = orderBy.map(([col, dir]) => `${col} ${dir}`).join(', ');
    return ` ORDER BY ${orders}`;
  }

  /**
   * @internal
   * Build SQL LIMIT and OFFSET clause.
   */
  private buildLimit(limit?: number, offset?: number): string {
    let sql = '';
    if (limit !== undefined) sql += ` LIMIT ${limit}`;
    if (offset !== undefined) sql += ` OFFSET ${offset}`;
    return sql;
  }

  /**
   * Find a single record matching the options.
   *
   * @param tableName - Table name
   * @param options - Query options
   * @returns Matching record or null
   *
   * @example
   * ```typescript
   * const user = qb.findOne('users', {
   *   where: { username: 'alice' },
   *   select: ['id', 'username', 'email']
   * });
   * ```
   */
  findOne(tableName: string, options: QueryOptions = {}): any | null {
    const select = options.select?.join(', ') || '*';
    const { sql: whereClause, params } = this.buildWhereClause(options.where);

    const query = `SELECT ${select} FROM ${tableName}${whereClause} LIMIT 1`;
    return this.connection.query(query).get(...params) || null;
  }

  /**
   * Find all records matching the options.
   *
   * @param tableName - Table name
   * @param options - Query options
   * @returns Array of matching records
   *
   * @example
   * ```typescript
   * const users = qb.findAll('users', {
   *   where: { age: { $gte: 18 }, status: 'active' },
   *   orderBy: [['created_at', 'DESC']],
   *   limit: 10,
   *   offset: 0
   * });
   * ```
   */
  findAll(tableName: string, options: QueryOptions = {}): any[] {
    const select = options.select?.join(', ') || '*';
    const { sql: whereClause, params } = this.buildWhereClause(options.where);
    const orderBy = this.buildOrderBy(options.orderBy);
    const limit = this.buildLimit(options.limit, options.offset);

    const query = `SELECT ${select} FROM ${tableName}${whereClause}${orderBy}${limit}`;
    return this.connection.query(query).all(...params) as any[];
  }

  /**
   * Count records matching the where condition.
   *
   * @param tableName - Table name
   * @param options - Query options (only `where` is used)
   * @returns Number of matching records
   *
   * @example
   * ```typescript
   * const count = qb.count('users', {
   *   where: { status: 'active' }
   * });
   * ```
   */
  count(tableName: string, options: { where?: Record<string, any> } = {}): number {
    const { sql: whereClause, params } = this.buildWhereClause(options.where);

    const query = `SELECT COUNT(*) as count FROM ${tableName}${whereClause}`;
    const result = this.connection.query(query).get(...params) as { count: number };
    return result.count;
  }

  /**
   * Insert a new record.
   *
   * @param tableName - Table name
   * @param data - Record data
   * @returns Inserted record with generated ID
   *
   * @example
   * ```typescript
   * const user = qb.insert('users', {
   *   username: 'alice',
   *   email: 'alice@example.com',
   *   age: 25
   * });
   * console.log(user.id); // Auto-generated ID
   * ```
   */
  insert(tableName: string, data: Record<string, any>): any {
    const serialized = this.serializeRecord(data);
    const columns = Object.keys(serialized);
    const values = Object.values(serialized);
    const placeholders = columns.map(() => '?').join(', ');

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    const stmt = this.connection.query(query);
    const info = stmt.run(...values);

    return (
      this.findOne(tableName, { where: { id: info.lastInsertRowid } }) || {
        ...data,
        id: info.lastInsertRowid,
      }
    );
  }

  /**
   * Insert multiple records in a single transaction.
   *
   * @param tableName - Table name
   * @param records - Array of records to insert
   * @returns Array of inserted records with generated IDs
   *
   * @example
   * ```typescript
   * const users = qb.bulkInsert('users', [
   *   { username: 'alice', email: 'alice@example.com' },
   *   { username: 'bob', email: 'bob@example.com' },
   *   { username: 'charlie', email: 'charlie@example.com' }
   * ]);
   * ```
   */
  bulkInsert(tableName: string, records: Record<string, any>[]): any[] {
    if (records.length === 0) return [];

    const columns = Object.keys(records[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

    return this.connection.transaction(() => {
      const stmt = this.connection.query(query);
      const results: any[] = [];

      for (const record of records) {
        const serialized = this.serializeRecord(record);
        const values = columns.map((col) => serialized[col]);
        const info = stmt.run(...values);
        results.push({ ...record, id: info.lastInsertRowid });
      }

      return results;
    });
  }

  /**
   * Update records matching the where condition.
   *
   * @param tableName - Table name
   * @param data - New values
   * @param where - Filter conditions
   * @returns Number of updated records
   *
   * @example
   * ```typescript
   * const updated = qb.update('users',
   *   { status: 'inactive' },
   *   { last_login: { $lt: '2024-01-01' } }
   * );
   * console.log(`${updated} users deactivated`);
   * ```
   */
  update(tableName: string, data: Record<string, any>, where: Record<string, any>): number {
    const serialized = this.serializeRecord(data);
    const setClause = Object.keys(serialized)
      .map((key) => `${key} = ?`)
      .join(', ');
    const { sql: whereClause, params: whereParams } = this.buildWhereClause(where);

    const query = `UPDATE ${tableName} SET ${setClause}${whereClause}`;
    const stmt = this.connection.query(query);
    const info = stmt.run(...Object.values(serialized), ...whereParams);

    return info.changes;
  }

  /**
   * Perform multiple updates in a single transaction.
   *
   * @param tableName - Table name
   * @param updates - Array of update operations
   * @returns Total number of updated records
   *
   * @example
   * ```typescript
   * const updated = qb.bulkUpdate('users', [
   *   { where: { id: 1 }, data: { status: 'active' } },
   *   { where: { id: 2 }, data: { status: 'inactive' } },
   *   { where: { id: 3 }, data: { status: 'banned' } }
   * ]);
   * ```
   */
  bulkUpdate(
    tableName: string,
    updates: Array<{ where: Record<string, any>; data: Record<string, any> }>
  ): number {
    return this.connection.transaction(() => {
      let totalChanges = 0;
      for (const { where, data } of updates) {
        totalChanges += this.update(tableName, data, where);
      }
      return totalChanges;
    });
  }

  /**
   * Delete records matching the where condition.
   *
   * @param tableName - Table name
   * @param where - Filter conditions
   * @returns Number of deleted records
   *
   * @example
   * ```typescript
   * const deleted = qb.delete('users', {
   *   status: 'banned',
   *   created_at: { $lt: '2023-01-01' }
   * });
   * console.log(`${deleted} users deleted`);
   * ```
   */
  delete(tableName: string, where: Record<string, any>): number {
    const { sql: whereClause, params } = this.buildWhereClause(where);

    const query = `DELETE FROM ${tableName}${whereClause}`;
    const stmt = this.connection.query(query);
    const info = stmt.run(...params);

    return info.changes;
  }

  /**
   * Perform an aggregation operation.
   *
   * @param tableName - Table name
   * @param operation - Aggregation operation (SUM, AVG, MIN, MAX, COUNT)
   * @param field - Field to aggregate
   * @param where - Optional filter conditions
   * @returns Aggregation result
   *
   * @example
   * ```typescript
   * const totalAge = qb.aggregate('users', 'SUM', 'age');
   * const avgAge = qb.aggregate('users', 'AVG', 'age', { status: 'active' });
   * const maxPrice = qb.aggregate('products', 'MAX', 'price', { category: 'electronics' });
   * ```
   */
  aggregate(
    tableName: string,
    operation: string,
    field: string,
    where?: Record<string, any>
  ): number {
    const { sql: whereClause, params } = this.buildWhereClause(where);
    const query = `SELECT ${operation}(${field}) as result FROM ${tableName}${whereClause}`;
    const result = this.connection.query(query).get(...params) as { result: number };
    return result.result || 0;
  }
}
