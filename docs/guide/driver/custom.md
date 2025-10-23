
# Creating Custom Drivers

This guide shows you how to create custom database drivers for Rinari ORM by understanding the driver architecture and implementing the required interfaces.

## Table of Contents

- [Driver Architecture](#driver-architecture)
- [Driver Types](#driver-types)
- [Core Interfaces](#core-interfaces)
- [Implementation Guide](#implementation-guide)
- [Best Practices](#best-practices)
- [Complete Examples](#complete-examples)

## Driver Architecture

Rinari's driver system provides a pluggable architecture that separates database-specific logic from the ORM core. Each driver is responsible for:

1. **Connection Management** - Establishing and maintaining database connections
2. **Schema Operations** - Creating tables, indexes, and managing schema
3. **Query Building** - Translating ORM queries into database-specific SQL/commands
4. **Data Serialization** - Converting between JavaScript and database types
5. **Transaction Handling** - Managing ACID transactions

### How Drivers Work

```
┌─────────────┐
│   ORM Core  │  ← Provides high-level API
└──────┬──────┘
       │ Uses Driver Interface
       │
┌──────▼──────────┐
│  Driver Layer   │  ← Translates to database operations
├─────────────────┤
│ - SQLiteDriver  │
│ - MongoDriver   │
│ - YourDriver    │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  Database/File  │  ← Actual data storage
└─────────────────┘
```

## Driver Types

### Synchronous Drivers

Use `SyncDriver` for databases that support synchronous operations:

```typescript
import type { SyncDriver, DriverMetadata, DriverConfig } from '@rinari/types';

class MyDriver implements SyncDriver {
  readonly metadata: DriverMetadata = {
    name: 'my-driver',
    version: '1.0.0',
  };

  // All methods return values directly (no Promises)
  findOne<T>(dbName: string, tableName: string, options: QueryOptions): T | null {
    // Return data synchronously
  }
  
  findAll<T>(dbName: string, tableName: string, options: QueryOptions): T[] {
    // Return data synchronously
  }
}
```

**Best for:**
- Local databases (SQLite, LevelDB)
- JSON file storage
- In-memory databases
- Embedded databases

**Characteristics:**
- No Promise overhead
- Simpler error handling
- Better performance for local operations
- Easier to debug

### Asynchronous Drivers

Use `AsyncDriver` for databases requiring async operations:

```typescript
import type { AsyncDriver, DriverMetadata, DriverConfig } from '@rinari/types';

class MyAsyncDriver implements AsyncDriver {
  readonly metadata: DriverMetadata = {
    name: 'my-async-driver',
    version: '1.0.0',
  };

  // All methods return Promises
  async findOne<T>(dbName: string, tableName: string, options: QueryOptions): Promise<T | null> {
    // Return data asynchronously
  }
  
  async findAll<T>(dbName: string, tableName: string, options: QueryOptions): Promise<T[]> {
    // Return data asynchronously
  }
}
```

**Best for:**
- Network databases (MongoDB, PostgreSQL, MySQL)
- Remote APIs
- Cloud storage (S3, Firebase)
- Distributed databases

**Characteristics:**
- Non-blocking I/O
- Network latency handling
- Concurrent request support
- Better for remote operations

## Core Interfaces

### Required Methods

All drivers must implement these methods:

#### Connection Lifecycle

```typescript
// Establish database connection
connect(config: DriverConfig): void | Promise<void>;

// Close connection and cleanup
disconnect(): void | Promise<void>;
```

#### Schema Management

```typescript
// Create a new table
createTable(dbName: string, tableName: string, schema: TableSchema): void | Promise<void>;

// Drop (delete) a table
dropTable(dbName: string, tableName: string): void | Promise<void>;

// Check if table exists
tableExists(dbName: string, tableName: string): boolean | Promise<boolean>;
```

#### CRUD Operations

```typescript
// Find single record
findOne<T>(dbName: string, tableName: string, options: QueryOptions): T | null | Promise<T | null>;

// Find multiple records
findAll<T>(dbName: string, tableName: string, options: QueryOptions): T[] | Promise<T[]>;

// Count records
count(dbName: string, tableName: string, where?: Record<string, any>): number | Promise<number>;

// Insert single record
insert<T>(dbName: string, tableName: string, data: Record<string, any>): T | Promise<T>;

// Insert multiple records
bulkInsert<T>(dbName: string, tableName: string, records: Record<string, any>[]): T[] | Promise<T[]>;

// Update records
update(dbName: string, tableName: string, data: Record<string, any>, where: Record<string, any>): number | Promise<number>;

// Bulk update
bulkUpdate(dbName: string, tableName: string, updates: Array<{where: Record<string, any>; data: Record<string, any>}>): number | Promise<number>;

// Delete records
delete(dbName: string, tableName: string, where: Record<string, any>): number | Promise<number>;
```

#### Index Operations

```typescript
// Create index
createIndex(dbName: string, tableName: string, indexName: string, options: IndexOptions): void | Promise<void>;

// Drop index
dropIndex(dbName: string, tableName: string, indexName: string): void | Promise<void>;
```

#### Transactions

```typescript
// Execute atomic transaction
transaction<T>(fn: () => T | Promise<T>): T | Promise<T>;
```

#### Optional: Aggregations

```typescript
// Perform aggregation (SUM, AVG, MIN, MAX, COUNT)
aggregate?(dbName: string, tableName: string, operation: string, field: string, where?: Record<string, any>): number | Promise<number>;
```

### QueryOptions Interface

Understanding the query options structure:

```typescript
interface QueryOptions {
  // Filter conditions
  where?: Record<string, any>;
  
  // Sort order: [['column', 'ASC'], ['other', 'DESC']]
  orderBy?: Array<[string, 'ASC' | 'DESC']>;
  
  // Limit number of results
  limit?: number;
  
  // Skip records (pagination)
  offset?: number;
  
  // Select specific columns
  select?: string[];
}
```

### WhereOperators

Support these operators in WHERE clauses:

```typescript
interface WhereOperators {
  $gt?: any;        // Greater than
  $gte?: any;       // Greater than or equal
  $lt?: any;        // Less than
  $lte?: any;       // Less than or equal
  $ne?: any;        // Not equal
  $in?: any[];      // In array
  $notIn?: any[];   // Not in array
  $like?: string;   // Pattern matching
  $between?: [any, any]; // Between two values
}
```

## Implementation Guide

### Step 1: Project Structure

Create a well-organized driver package:

```
packages/my-driver/
├── src/
│   ├── driver.ts          # Main driver implementation
│   ├── connection.ts      # Connection management
│   ├── query-builder.ts   # Query building logic
│   ├── schema.ts          # Schema management
│   ├── serializer.ts      # Data type conversion
│   └── index.ts           # Public exports
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

### Step 2: Connection Management

Create a robust connection wrapper:

```typescript
// src/connection.ts
export interface ConnectionOptions {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  timeout?: number;
}

export class Connection {
  private client: any;
  private isConnected: boolean = false;
  private options: ConnectionOptions;

  constructor(options: ConnectionOptions) {
    this.options = options;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;
    
    try {
      // Initialize your database client
      this.client = await createDatabaseClient(this.options);
      this.isConnected = true;
    } catch (error) {
      throw new Error(`Failed to connect: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      await this.client.close();
      this.isConnected = false;
    } catch (error) {
      throw new Error(`Failed to disconnect: ${error.message}`);
    }
  }

  getClient(): any {
    if (!this.isConnected) {
      throw new Error('Not connected to database');
    }
    return this.client;
  }

  async execute(query: string, params: any[]): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Not connected to database');
    }
    return await this.client.query(query, params);
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    await this.execute('BEGIN', []);
    try {
      const result = await fn();
      await this.execute('COMMIT', []);
      return result;
    } catch (error) {
      await this.execute('ROLLBACK', []);
      throw error;
    }
  }
}
```

### Step 3: Data Serialization

Handle type conversions properly:

```typescript
// src/serializer.ts
import type { DataType } from '@rinari/types';

export class DataSerializer {
  /**
   * Serialize value for database storage
   */
  static serialize(value: any, type?: DataType): any {
    if (value === null || value === undefined) {
      return null;
    }

    // Handle dates
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Handle booleans (if DB doesn't support them natively)
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    // Handle JSON/objects
    if (typeof value === 'object' && !(value instanceof Buffer)) {
      return JSON.stringify(value);
    }

    return value;
  }

  /**
   * Deserialize value from database
   */
  static deserialize(value: any, type?: DataType): any {
    if (value === null || value === undefined) {
      return null;
    }

    if (!type) return value;

    switch (type) {
      case 'DATE':
      case 'DATETIME':
        return new Date(value);
      
      case 'BOOLEAN':
        return value === 1 || value === true || value === 'true';
      
      case 'JSON':
      case 'OBJECT':
      case 'ARRAY':
        return typeof value === 'string' ? JSON.parse(value) : value;
      
      case 'INTEGER':
      case 'NUMBER':
        return Number(value);
      
      default:
        return value;
    }
  }

  /**
   * Serialize entire record
   */
  static serializeRecord(data: Record<string, any>): Record<string, any> {
    const serialized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = this.serialize(value);
    }
    return serialized;
  }
}
```

### Step 4: Query Builder

Build database-specific queries:

```typescript
// src/query-builder.ts
import type { QueryOptions, WhereOperators } from '@rinari/types';
import { Connection } from './connection.js';
import { DataSerializer } from './serializer.js';

export class QueryBuilder {
  constructor(private connection: Connection) {}

  /**
   * Build WHERE clause from query options
   */
  private buildWhereClause(where?: Record<string, any>): { sql: string; params: any[] } {
    if (!where || Object.keys(where).length === 0) {
      return { sql: '', params: [] };
    }

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1; // For databases using $1, $2 syntax

    for (const [key, value] of Object.entries(where)) {
      if (value === null) {
        conditions.push(`${key} IS NULL`);
      } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const operators = value as WhereOperators;

        if ('$gt' in operators) {
          conditions.push(`${key} > $${paramIndex++}`);
          params.push(DataSerializer.serialize(operators.$gt));
        }
        if ('$gte' in operators) {
          conditions.push(`${key} >= $${paramIndex++}`);
          params.push(DataSerializer.serialize(operators.$gte));
        }
        if ('$lt' in operators) {
          conditions.push(`${key} < $${paramIndex++}`);
          params.push(DataSerializer.serialize(operators.$lt));
        }
        if ('$lte' in operators) {
          conditions.push(`${key} <= $${paramIndex++}`);
          params.push(DataSerializer.serialize(operators.$lte));
        }
        if ('$ne' in operators) {
          conditions.push(`${key} != $${paramIndex++}`);
          params.push(DataSerializer.serialize(operators.$ne));
        }
        if ('$in' in operators && Array.isArray(operators.$in)) {
          const placeholders = operators.$in.map(() => `$${paramIndex++}`).join(', ');
          conditions.push(`${key} IN (${placeholders})`);
          params.push(...operators.$in.map(v => DataSerializer.serialize(v)));
        }
        if ('$notIn' in operators && Array.isArray(operators.$notIn)) {
          const placeholders = operators.$notIn.map(() => `$${paramIndex++}`).join(', ');
          conditions.push(`${key} NOT IN (${placeholders})`);
          params.push(...operators.$notIn.map(v => DataSerializer.serialize(v)));
        }
        if ('$like' in operators) {
          conditions.push(`${key} LIKE $${paramIndex++}`);
          params.push(operators.$like);
        }
        if ('$between' in operators && Array.isArray(operators.$between)) {
          conditions.push(`${key} BETWEEN $${paramIndex++} AND $${paramIndex++}`);
          params.push(
            DataSerializer.serialize(operators.$between[0]),
            DataSerializer.serialize(operators.$between[1])
          );
        }
      } else {
        conditions.push(`${key} = $${paramIndex++}`);
        params.push(DataSerializer.serialize(value));
      }
    }

    return {
      sql: conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  /**
   * Build ORDER BY clause
   */
  private buildOrderBy(orderBy?: Array<[string, 'ASC' | 'DESC']>): string {
    if (!orderBy || orderBy.length === 0) return '';
    const orders = orderBy.map(([col, dir]) => `${col} ${dir}`).join(', ');
    return ` ORDER BY ${orders}`;
  }

  /**
   * Build LIMIT/OFFSET clause
   */
  private buildLimit(limit?: number, offset?: number): string {
    let sql = '';
    if (limit !== undefined) sql += ` LIMIT ${limit}`;
    if (offset !== undefined) sql += ` OFFSET ${offset}`;
    return sql;
  }

  async findOne(tableName: string, options: QueryOptions = {}): Promise<any | null> {
    const select = options.select?.join(', ') || '*';
    const { sql: whereClause, params } = this.buildWhereClause(options.where);
    
    const query = `SELECT ${select} FROM ${tableName}${whereClause} LIMIT 1`;
    const results = await this.connection.execute(query, params);
    return results[0] || null;
  }

  async findAll(tableName: string, options: QueryOptions = {}): Promise<any[]> {
    const select = options.select?.join(', ') || '*';
    const { sql: whereClause, params } = this.buildWhereClause(options.where);
    const orderBy = this.buildOrderBy(options.orderBy);
    const limit = this.buildLimit(options.limit, options.offset);
    
    const query = `SELECT ${select} FROM ${tableName}${whereClause}${orderBy}${limit}`;
    return await this.connection.execute(query, params);
  }

  async count(tableName: string, where?: Record<string, any>): Promise<number> {
    const { sql: whereClause, params } = this.buildWhereClause(where);
    const query = `SELECT COUNT(*) as count FROM ${tableName}${whereClause}`;
    const result = await this.connection.execute(query, params);
    return result[0]?.count || 0;
  }

  async insert(tableName: string, data: Record<string, any>): Promise<any> {
    const serialized = DataSerializer.serializeRecord(data);
    const columns = Object.keys(serialized);
    const values = Object.values(serialized);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.connection.execute(query, values);
    return result[0];
  }

  async update(tableName: string, data: Record<string, any>, where: Record<string, any>): Promise<number> {
    const serialized = DataSerializer.serializeRecord(data);
    const setClause = Object.keys(serialized).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const { sql: whereClause, params: whereParams } = this.buildWhereClause(where);
    
    const query = `UPDATE ${tableName} SET ${setClause}${whereClause}`;
    const result = await this.connection.execute(query, [...Object.values(serialized), ...whereParams]);
    return result.rowCount || 0;
  }

  async delete(tableName: string, where: Record<string, any>): Promise<number> {
    const { sql: whereClause, params } = this.buildWhereClause(where);
    const query = `DELETE FROM ${tableName}${whereClause}`;
    const result = await this.connection.execute(query, params);
    return result.rowCount || 0;
  }
}
```

### Step 5: Schema Management

Handle DDL operations:

```typescript
// src/schema.ts
import type { TableSchema, ColumnDefinition, IndexOptions, DataType } from '@rinari/types';
import { Connection } from './connection.js';

export class SchemaManager {
  constructor(private connection: Connection) {}

  /**
   * Map Rinari data types to database-specific types
   */
  private mapTypeToSQL(type: DataType, options: ColumnDefinition): string {
    let sql = '';

    // Map types to your database's native types
    switch (type) {
      case 'TEXT':
      case 'STRING':
        sql = 'VARCHAR(255)';
        break;
      case 'INTEGER':
      case 'NUMBER':
        sql = 'INTEGER';
        break;
      case 'REAL':
        sql = 'DOUBLE PRECISION';
        break;
      case 'BOOLEAN':
        sql = 'BOOLEAN';
        break;
      case 'DATE':
        sql = 'DATE';
        break;
      case 'DATETIME':
        sql = 'TIMESTAMP';
        break;
      case 'JSON':
      case 'OBJECT':
      case 'ARRAY':
        sql = 'JSON';
        break;
      case 'BLOB':
        sql = 'BYTEA';
        break;
      default:
        sql = 'TEXT';
    }

    // Add constraints
    if (options.primaryKey) {
      sql += ' PRIMARY KEY';
      if (options.autoIncrement) {
        sql += ' GENERATED ALWAYS AS IDENTITY';
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
        sql += ' DEFAULT NULL';
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

  async createTable(tableName: string, schema: TableSchema): Promise<void> {
    const columns: string[] = [];

    for (const [columnName, definition] of Object.entries(schema)) {
      const columnDef = `${columnName} ${this.mapTypeToSQL(definition.type, definition)}`;
      columns.push(columnDef);
    }

    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(', ')})`;
    await this.connection.execute(query, []);
  }

  async dropTable(tableName: string): Promise<void> {
    const query = `DROP TABLE IF EXISTS ${tableName}`;
    await this.connection.execute(query, []);
  }

  async tableExists(tableName: string): Promise<boolean> {
    const query = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`;
    const result = await this.connection.execute(query, [tableName]);
    return result[0]?.exists || false;
  }

  async createIndex(tableName: string, indexName: string, options: IndexOptions): Promise<void> {
    const unique = options.unique ? 'UNIQUE' : '';
    const columns = options.columns.join(', ');
    const where = options.where ? ` WHERE ${options.where}` : '';
    
    const query = `CREATE ${unique} INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns})${where}`;
    await this.connection.execute(query, []);
  }

  async dropIndex(indexName: string): Promise<void> {
    const query = `DROP INDEX IF EXISTS ${indexName}`;
    await this.connection.execute(query, []);
  }
}
```

### Step 6: Main Driver Implementation

Bring everything together:

```typescript
// src/driver.ts
import type {
  AsyncDriver,
  DriverConfig,
  DriverMetadata,
  TableSchema,
  QueryOptions,
  IndexOptions,
} from '@rinari/types';
import { Connection } from './connection.js';
import { QueryBuilder } from './query-builder.js';
import { SchemaManager } from './schema.js';

export class MyCustomDriver implements AsyncDriver {
  readonly metadata: DriverMetadata = {
    name: 'my-custom-driver',
    version: '1.0.0',
  };

  private connections: Map<string, Connection> = new Map();
  private queryBuilders: Map<string, QueryBuilder> = new Map();
  private schemaManagers: Map<string, SchemaManager> = new Map();
  private config: DriverConfig;

  constructor(config: DriverConfig) {
    this.config = config;
  }

  async connect(config: DriverConfig): Promise<void> {
    this.config = config;
    // Connections are created lazily when first accessed
  }

  async disconnect(): Promise<void> {
    for (const connection of this.connections.values()) {
      await connection.disconnect();
    }
    this.connections.clear();
    this.queryBuilders.clear();
    this.schemaManagers.clear();
  }

  private async getConnection(dbName: string): Promise<Connection> {
    let connection = this.connections.get(dbName);
    
    if (!connection) {
      connection = new Connection({
        ...this.config,
        database: dbName,
      });
      await connection.connect();
      this.connections.set(dbName, connection);
      this.queryBuilders.set(dbName, new QueryBuilder(connection));
      this.schemaManagers.set(dbName, new SchemaManager(connection));
    }
    
    return connection;
  }

  private async getQueryBuilder(dbName: string): Promise<QueryBuilder> {
    await this.getConnection(dbName);
    return this.queryBuilders.get(dbName)!;
  }

  private async getSchemaManager(dbName: string): Promise<SchemaManager> {
    await this.getConnection(dbName);
    return this.schemaManagers.get(dbName)!;
  }

  async createTable(dbName: string, tableName: string, schema: TableSchema): Promise<void> {
    const schemaManager = await this.getSchemaManager(dbName);
    await schemaManager.createTable(tableName, schema);
  }

  async dropTable(dbName: string, tableName: string): Promise<void> {
    const schemaManager = await this.getSchemaManager(dbName);
    await schemaManager.dropTable(tableName);
  }

  async tableExists(dbName: string, tableName: string): Promise<boolean> {
    const schemaManager = await this.getSchemaManager(dbName);
    return await schemaManager.tableExists(tableName);
  }

  async findOne<T>(dbName: string, tableName: string, options: QueryOptions): Promise<T | null> {
    const queryBuilder = await this.getQueryBuilder(dbName);
    return await queryBuilder.findOne(tableName, options);
  }

  async findAll<T>(dbName: string, tableName: string, options: QueryOptions): Promise<T[]> {
    const queryBuilder = await this.getQueryBuilder(dbName);
    return await queryBuilder.findAll(tableName, options);
  }

  async count(dbName: string, tableName: string, where?: Record<string, any>): Promise<number> {
    const queryBuilder = await this.getQueryBuilder(dbName);
    return await queryBuilder.count(tableName, where);
  }

  async insert<T>(dbName: string, tableName: string, data: Record<string, any>): Promise<T> {
    const queryBuilder = await this.getQueryBuilder(dbName);
    return await queryBuilder.insert(tableName, data);
  }

  async bulkInsert<T>(dbName: string, tableName: string, records: Record<string, any>[]): Promise<T[]> {
    const connection = await this.getConnection(dbName);
    return await connection.transaction(async () => {
      const queryBuilder = await this.getQueryBuilder(dbName);
      const results: T[] = [];
      for (const record of records) {
        const result = await queryBuilder.insert(tableName, record);
        results.push(result);
      }
      return results;
    });
  }

  async update(dbName: string, tableName: string, data: Record<string, any>, where: Record<string, any>): Promise<number> {
    const queryBuilder = await this.getQueryBuilder(dbName);
    return await queryBuilder.update(tableName, data, where);
  }

  async bulkUpdate(dbName: string, tableName: string, updates: Array<{where: Record<string, any>; data: Record<string, any>}>): Promise<number> {
    const connection = await this.getConnection(dbName);
    return await connection.transaction(async () => {
      const queryBuilder = await this.getQueryBuilder(dbName);
      let total = 0;
      for (const { where, data } of updates) {
        total += await queryBuilder.update(tableName, data, where);
      }
      return total;
    });
  }

  async delete(dbName: string, tableName: string, where: Record<string, any>): Promise<number> {
    const queryBuilder = await this.getQueryBuilder(dbName);
    return await queryBuilder.delete(tableName, where);
  }

  async createIndex(dbName: string, tableName: string, indexName: string, options: IndexOptions): Promise<void> {
    const schemaManager = await this.getSchemaManager(dbName);
    await schemaManager.createIndex(tableName, indexName, options);
  }

  async dropIndex(dbName: string, tableName: string, indexName: string): Promise<void> {
    const schemaManager = await this.getSchemaManager(dbName);
    await schemaManager.dropIndex(indexName);
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    const firstConnection = this.connections.values().next().value;
    if (!firstConnection) {
      throw new Error('No database connection available');
    }
    return await firstConnection.transaction(fn);
  }

  async aggregate(dbName: string, tableName: string, operation: string, field: string, where?: Record<string, any>): Promise<number> {
    const queryBuilder = await this.getQueryBuilder(dbName);
    const { sql: whereClause, params } = (queryBuilder as any).buildWhereClause(where);
    const connection = await this.getConnection(dbName);
    const query = `SELECT ${operation}(${field}) as result FROM ${tableName}${whereClause}`;
    const result = await connection.execute(query, params);
    return result[0]?.result || 0;
  }
}
```

### Step 7: Package Configuration

Set up your package.json:

```json
{
  "name": "@rinari/my-driver",
  "version": "1.0.0",
  "description": "Custom driver for @rinari/orm",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "dependencies": {
    "@rinari/types": "1.0.0"
  },
  "devDependencies": {
    "@types/node": "^24.8.1",
    "tsup": "^8.5.0",
    "typescript": "^5.9.3"
  },
  "peerDependencies": {
    "@rinari/orm": "^1.0.0"
  }
}
```

### Step 8: Public Exports

Export your driver API:

```typescript
// src/index.ts
export { MyCustomDriver } from './driver.js';
export { Connection } from './connection.js';
export { QueryBuilder } from './query-builder.js';
export { SchemaManager } from './schema.js';
export type { ConnectionOptions } from './connection.js';
```

## Best Practices

### 1. Comprehensive Error Handling

Provide meaningful error messages with context:

```typescript
async findOne<T>(dbName: string, tableName: string, options: QueryOptions): Promise<T | null> {
  try {
    const queryBuilder = await this.getQueryBuilder(dbName);
    return await queryBuilder.findOne(tableName, options);
  } catch (error) {
    throw new Error(
      `Failed to find record in ${dbName}.${tableName}: ${error.message}`
    );
  }
}
```

### 2. Connection Pooling

For network databases, implement efficient connection pooling:

```typescript
class ConnectionPool {
  private pool: Connection[] = [];
  private maxConnections: number = 10;
  private minConnections: number = 2;

  async acquire(): Promise<Connection> {
    // Get available connection or create new one
  }

  async release(connection: Connection): Promise<void> {
    // Return connection to pool
  }
}
```

### 3. Type Safety

Maintain type safety throughout:

```typescript
// Define strict types for your driver's configuration
export interface MyDriverConfig extends DriverConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

// Use them in your driver
constructor(config: MyDriverConfig) {
  this.config = config;
}
```

### 4. Data Type Mapping

Create a comprehensive type mapping:

```typescript
const TYPE_MAPPING: Record<DataType, string> = {
  'TEXT': 'VARCHAR(255)',
  'STRING': 'VARCHAR(255)',
  'INTEGER': 'INTEGER',
  'NUMBER': 'INTEGER',
  'REAL': 'DOUBLE PRECISION',
  'BOOLEAN': 'BOOLEAN',
  'DATE': 'DATE',
  'DATETIME': 'TIMESTAMP',
  'JSON': 'JSONB',
  'OBJECT': 'JSONB',
  'ARRAY': 'JSONB',
  'BLOB': 'BYTEA',
};
```

### 5. Transaction Safety

Ensure proper transaction rollback:

```typescript
async transaction<T>(fn: () => Promise<T>): Promise<T> {
  const client = await this.pool.acquire();
  
  try {
    await client.query('BEGIN');
    const result = await fn();
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await this.pool.release(client);
  }
}
```

### 6. Testing

Write comprehensive tests:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MyCustomDriver } from '../src/driver.js';
import { ORM } from '@rinari/orm';
import { DataTypes } from '@rinari/types';

describe('MyCustomDriver', () => {
  let orm: ORM;
  let driver: MyCustomDriver;

  beforeEach(async () => {
    driver = new MyCustomDriver({
      host: 'localhost',
      port: 5432,
      database: 'test',
    });
    await driver.connect(driver.config);
    orm = new ORM({ driver });
  });

  afterEach(async () => {
    await orm.disconnect();
  });

  it('should create and retrieve records', async () => {
    const User = orm.define('test', 'users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.TEXT, notNull: true },
    });

    const user = await User.create({ name: 'Alice' });
    expect(user.name).toBe('Alice');

    const found = await User.findOne({ where: { name: 'Alice' } });
    expect(found).toEqual(user);
  });

  it('should handle transactions correctly', async () => {
    const User = orm.define('test', 'users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.TEXT, notNull: true },
    });

    await expect(async () => {
      await User.transaction(async () => {
        await User.create({ name: 'Bob' });
        throw new Error('Rollback');
      });
    }).rejects.toThrow('Rollback');

    const count = await User.count();
    expect(count).toBe(0); // Should be rolled back
  });

  it('should support complex queries', async () => {
    const User = orm.define('test', 'users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.TEXT, notNull: true },
      age: { type: DataTypes.INTEGER },
    });

    await User.bulkCreate([
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 20 },
    ]);

    const adults = await User.findAll({
      where: { age: { $gte: 25 } },
      orderBy: [['age', 'DESC']],
    });

    expect(adults).toHaveLength(2);
    expect(adults[0].name).toBe('Bob');
  });
});
```

### 7. Documentation

Document your driver thoroughly:

```typescript
/**
 * Custom database driver for Rinari ORM.
 * 
 * @remarks
 * This driver supports PostgreSQL databases with connection pooling,
 * ACID transactions, and full query operator support.
 * 
 * @example
 * ```typescript
 * import { MyCustomDriver } from '@rinari/my-driver';
 * import { ORM } from '@rinari/orm';
 * 
 * const driver = new MyCustomDriver({
 *   host: 'localhost',
 *   port: 5432,
 *   database: 'myapp',
 *   username: 'user',
 *   password: 'pass',
 * });
 * 
 * const orm = new ORM({ driver });
 * ```
 */
export class MyCustomDriver implements AsyncDriver {
  // Implementation
}
```

## Complete Examples

### Example 1: JSON File Driver (Synchronous)

A complete, production-ready JSON file driver:

```typescript
import type { SyncDriver, DriverMetadata, TableSchema, QueryOptions, IndexOptions } from '@rinari/types';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class JSONDriver implements SyncDriver {
  readonly metadata: DriverMetadata = {
    name: 'json',
    version: '1.0.0',
  };

  private storageDir: string;
  private databases: Map<string, any> = new Map();

  constructor(config: { storageDir: string }) {
    this.storageDir = config.storageDir;
    if (!existsSync(this.storageDir)) {
      mkdirSync(this.storageDir, { recursive: true });
    }
  }

  connect(): void {
    // Load existing databases
  }

  disconnect(): void {
    // Save all databases
    for (const [dbName, data] of this.databases) {
      this.saveDatabase(dbName);
    }
    this.databases.clear();
  }

  private getDatabase(dbName: string): any {
    if (!this.databases.has(dbName)) {
      const filepath = join(this.storageDir, `${dbName}.json`);
      if (existsSync(filepath)) {
        const data = JSON.parse(readFileSync(filepath, 'utf-8'));
        this.databases.set(dbName, data);
      } else {
        this.databases.set(dbName, {});
      }
    }
    return this.databases.get(dbName);
  }

  private saveDatabase(dbName: string): void {
    const filepath = join(this.storageDir, `${dbName}.json`);
    const data = this.databases.get(dbName);
    writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  createTable(dbName: string, tableName: string, schema: TableSchema): void {
    const db = this.getDatabase(dbName);
    if (!db[tableName]) {
      db[tableName] = [];
      this.saveDatabase(dbName);
    }
  }

  dropTable(dbName: string, tableName: string): void {
    const db = this.getDatabase(dbName);
    delete db[tableName];
    this.saveDatabase(dbName);
  }

  tableExists(dbName: string, tableName: string): boolean {
    const db = this.getDatabase(dbName);
    return tableName in db;
  }

  findOne<T>(dbName: string, tableName: string, options: QueryOptions): T | null {
    const records = this.findAll<T>(dbName, tableName, { ...options, limit: 1 });
    return records[0] || null;
  }

  findAll<T>(dbName: string, tableName: string, options: QueryOptions = {}): T[] {
    const db = this.getDatabase(dbName);
    let records = db[tableName] || [];

    // Apply where filter
    if (options.where) {
      records = records.filter((record: any) => this.matchesWhere(record, options.where!));
    }

    // Apply ordering
    if (options.orderBy) {
      records.sort((a: any, b: any) => {
        for (const [field, dir] of options.orderBy!) {
          if (a[field] < b[field]) return dir === 'ASC' ? -1 : 1;
          if (a[field] > b[field]) return dir === 'ASC' ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply limit/offset
    if (options.offset) records = records.slice(options.offset);
    if (options.limit) records = records.slice(0, options.limit);

    // Apply select
    if (options.select) {
      records = records.map((record: any) => {
        const selected: any = {};
        for (const field of options.select!) {
          selected[field] = record[field];
        }
        return selected;
      });
    }

    return records;
  }

  private matchesWhere(record: any, where: Record<string, any>): boolean {
    return Object.entries(where).every(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        // Handle operators
        if ('$gt' in value && !(record[key] > value.$gt)) return false;
        if ('$gte' in value && !(record[key] >= value.$gte)) return false;
        if ('$lt' in value && !(record[key] < value.$lt)) return false;
        if ('$lte' in value && !(record[key] <= value.$lte)) return false;
        if ('$ne' in value && record[key] === value.$ne) return false;
        if ('$in' in value && !value.$in.includes(record[key])) return false;
        if ('$notIn' in value && value.$notIn.includes(record[key])) return false;
        if ('$like' in value) {
          const pattern = value.$like.replace(/%/g, '.*');
          const regex = new RegExp(pattern, 'i');
          if (!regex.test(record[key])) return false;
        }
        return true;
      }
      return record[key] === value;
    });
  }

  count(dbName: string, tableName: string, where?: Record<string, any>): number {
    return this.findAll(dbName, tableName, { where }).length;
  }

  insert<T>(dbName: string, tableName: string, data: Record<string, any>): T {
    const db = this.getDatabase(dbName);
    const records = db[tableName] || [];
    const id = records.length > 0 ? Math.max(...records.map((r: any) => r.id || 0)) + 1 : 1;
    const record = { id, ...data };
    records.push(record);
    this.saveDatabase(dbName);
    return record as T;
  }

  bulkInsert<T>(dbName: string, tableName: string, records: Record<string, any>[]): T[] {
    return records.map(record => this.insert<T>(dbName, tableName, record));
  }

  update(dbName: string, tableName: string, data: Record<string, any>, where: Record<string, any>): number {
    const db = this.getDatabase(dbName);
    const records = db[tableName] || [];
    let count = 0;

    for (const record of records) {
      if (this.matchesWhere(record, where)) {
        Object.assign(record, data);
        count++;
      }
    }

    if (count > 0) this.saveDatabase(dbName);
    return count;
  }

  bulkUpdate(dbName: string, tableName: string, updates: Array<{where: Record<string, any>; data: Record<string, any>}>): number {
    let total = 0;
    for (const { where, data } of updates) {
      total += this.update(dbName, tableName, data, where);
    }
    return total;
  }

  delete(dbName: string, tableName: string, where: Record<string, any>): number {
    const db = this.getDatabase(dbName);
    const records = db[tableName] || [];
    const initialLength = records.length;

    db[tableName] = records.filter((record: any) => !this.matchesWhere(record, where));

    const deleted = initialLength - db[tableName].length;
    if (deleted > 0) this.saveDatabase(dbName);
    return deleted;
  }

  createIndex(): void {
    // JSON doesn't support indexes
  }

  dropIndex(): void {
    // JSON doesn't support indexes
  }

  transaction<T>(fn: () => T): T {
    // Simple execution (no real transaction support)
    return fn();
  }

  aggregate(dbName: string, tableName: string, operation: string, field: string, where?: Record<string, any>): number {
    const records = this.findAll(dbName, tableName, { where });
    const values = records.map((r: any) => r[field]).filter(v => typeof v === 'number');
    
    switch (operation.toUpperCase()) {
      case 'SUM':
        return values.reduce((sum, val) => sum + val, 0);
      case 'AVG':
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      case 'MIN':
        return values.length > 0 ? Math.min(...values) : 0;
      case 'MAX':
        return values.length > 0 ? Math.max(...values) : 0;
      case 'COUNT':
        return records.length;
      default:
        return 0;
    }
  }
}
```

### Example 2: Using Your Custom Driver

```typescript
import { ORM } from '@rinari/orm';
import { MyCustomDriver } from './my-driver';
import { DataTypes } from '@rinari/types';

// Initialize with your custom driver
const orm = new ORM({
  driver: new MyCustomDriver({
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    username: 'user',
    password: 'password',
  }),
});

// Define models as usual
const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true },
  created_at: { type: DataTypes.DATETIME, default: new Date().toISOString() },
});

// Use the ORM normally
const user = await User.create({
  username: 'alice',
  email: 'alice@example.com',
});

const users = await User.findAll({
  where: { created_at: { $gte: '2024-01-01' } },
  orderBy: [['username', 'ASC']],
});

await orm.disconnect();
```

## Next Steps

- [Driver Overview](./overview.md) - Understanding driver architecture
- [SQLite Driver Guide](./sqlite.md) - Learn from the reference implementation
- [Core Concepts](../core-concepts.md) - Understanding ORM fundamentals
- [API Documentation](../../api/README.md) - Complete API reference

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [@rinari/types API](../../api/types/README.md) - Type definitions reference
- [SQLite Driver Source](https://github.com/OpenUwU/rinari/tree/main/packages/sqlite) - Reference implementation
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Example of native bindings

## Support

If you're building a custom driver and need help:

- [GitHub Issues](https://github.com/OpenUwU/rinari/issues) - Report bugs or request features
- [Discord Community](https://discord.gg/zqxWVH3CvG) - Get help from the community
