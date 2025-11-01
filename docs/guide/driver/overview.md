# Driver System Overview

Rinari's driver system provides a pluggable architecture for connecting to
different databases.

## What is a Driver?

A driver is a database-specific implementation that handles:

- Connection management
- Query execution
- Data serialization/deserialization
- Transaction handling
- Schema management

## Driver Types

### Synchronous Drivers

Synchronous drivers return values directly without Promises.

**Characteristics:**

- Simpler API (no async/await needed)
- Better performance for local databases
- Easier to debug
- Suitable for: SQLite, JSON files

**Example:**

```typescript
import { SQLiteDriver } from '@rinari/sqlite';

const driver = new SQLiteDriver({ storageDir: './data' });
const user = driver.findOne('default', 'users', { where: { id: 1 } });
console.log(user); // No await needed
```

### Asynchronous Drivers

Asynchronous drivers return Promises for all operations.

**Characteristics:**

- Required for network databases
- Non-blocking I/O
- Suitable for: MongoDB, PostgreSQL, MySQL

**Example:**

```typescript
const driver = new MongoDriver({ url: 'mongodb://localhost' });
const user = await driver.findOne('default', 'users', { where: { id: 1 } });
```

## Available Drivers

### @rinari/sqlite

High-performance synchronous SQLite driver.

```typescript
import { SQLiteDriver } from '@rinari/sqlite';

const driver = new SQLiteDriver({
  storageDir: './data',
  verbose: false,
  readonly: false,
});
```

**Features:**

- Built on better-sqlite3
- Multi-database support
- ACID transactions
- WAL mode enabled
- Advanced query operators

## Driver Interface

All drivers must implement either `SyncDriver` or `AsyncDriver` interface:

```typescript
interface Driver {
  readonly metadata: DriverMetadata;

  connect(config: DriverConfig): Promise<void> | void;
  disconnect(): Promise<void> | void;

  createTable(
    dbName: string,
    tableName: string,
    schema: TableSchema
  ): Promise<void> | void;
  dropTable(dbName: string, tableName: string): Promise<void> | void;
  tableExists(dbName: string, tableName: string): Promise<boolean> | boolean;

  findOne<T>(
    dbName: string,
    tableName: string,
    options: QueryOptions
  ): Promise<T | null> | T | null;
  findAll<T>(
    dbName: string,
    tableName: string,
    options: QueryOptions
  ): Promise<T[]> | T[];
  count(
    dbName: string,
    tableName: string,
    where?: Record<string, any>
  ): Promise<number> | number;

  insert<T>(
    dbName: string,
    tableName: string,
    data: Record<string, any>
  ): Promise<T> | T;
  bulkInsert<T>(
    dbName: string,
    tableName: string,
    records: Record<string, any>[]
  ): Promise<T[]> | T[];
  update(
    dbName: string,
    tableName: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<number> | number;
  bulkUpdate(
    dbName: string,
    tableName: string,
    updates: Array<{ where: Record<string, any>; data: Record<string, any> }>
  ): Promise<number> | number;
  delete(
    dbName: string,
    tableName: string,
    where: Record<string, any>
  ): Promise<number> | number;

  createIndex(
    dbName: string,
    tableName: string,
    indexName: string,
    options: IndexOptions
  ): Promise<void> | void;
  dropIndex(
    dbName: string,
    tableName: string,
    indexName: string
  ): Promise<void> | void;

  transaction<T>(fn: () => T | Promise<T>): Promise<T> | T;

  aggregate?(
    dbName: string,
    tableName: string,
    operation: string,
    field: string,
    where?: Record<string, any>
  ): Promise<number> | number;
}
```

## Using Drivers with ORM

```typescript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

const User = orm.define('default', 'users', schema);
```

## Driver Configuration

Each driver accepts specific configuration options:

### SQLite Driver Config

```typescript
interface SQLiteConfig {
  storageDir: string; // Required: Directory for database files
  verbose?: boolean; // Enable SQL logging
  readonly?: boolean; // Read-only mode
}
```

## Multi-Database Support

Drivers support managing multiple databases:

```typescript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

// Each database gets its own file
const User = orm.define('users_db', 'users', userSchema);
const Post = orm.define('content_db', 'posts', postSchema);
```

Creates:

- `./data/users_db.sqlite`
- `./data/content_db.sqlite`

## Driver Metadata

All drivers expose metadata:

```typescript
console.log(driver.metadata);
// { name: 'sqlite', version: '1.0.0' }

console.log(orm.driverInfo);
// { name: 'sqlite', version: '1.0.0' }
```

## Transaction Support

All drivers support transactions:

```typescript
driver.transaction(() => {
  driver.insert('default', 'users', { username: 'alice' });
  driver.insert('default', 'profiles', { userId: 1, bio: 'Hello' });
});
```

## Best Practices

1. **Choose the Right Driver**
   - Use sync drivers for local databases
   - Use async drivers for network databases

2. **Connection Management**
   - Always call `disconnect()` when done
   - Reuse driver instances

3. **Error Handling**
   - Wrap operations in try-catch
   - Handle driver-specific errors

4. **Performance**
   - Use bulk operations when possible
   - Enable WAL mode for SQLite
   - Create indexes on frequently queried columns

## Next Steps

- [SQLite Driver Guide](./sqlite.md)
- [Creating Custom Drivers](./custom.md)
