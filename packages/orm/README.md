
# @rinari/orm

Lightweight, modular ORM for Node.js and Bun with pluggable database drivers.

[![npm version](https://img.shields.io/npm/v/@rinari/orm.svg?style=for-the-badge&)](https://www.npmjs.com/package/@rinari/orm)
[![License](https://img.shields.io/badge/license-OUOL--1.0-blue.svg?style=for-the-badge&)](https://github.com/OpenUwU/rinari/blob/main/LICENSE)

## Overview

`@rinari/orm` is the core package of the Rinari ORM framework, providing a powerful yet simple API for database operations. It features a pluggable driver architecture, full TypeScript support, and works seamlessly with both synchronous and asynchronous drivers.

## Features

- **Zero Dependencies** - Core ORM has no external dependencies
- **Pluggable Drivers** - Support for multiple database backends
- **Multi-Database** - Manage multiple databases simultaneously
- **Type-Safe** - Full TypeScript support with automatic type inference
- **Sync and Async** - Compatible with both sync and async drivers
- **Lightweight** - Minimal overhead, maximum performance
- **Transaction Support** - ACID transactions for data integrity
- **Query Operators** - Rich query language with comparison, pattern matching, and range operators

## Installation

```bash
npm install @rinari/orm
```

**Choose a driver:**

```bash
# SQLite (recommended for most applications)
npm install @rinari/sqlite
```

## Quick Start

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

// Initialize ORM with driver
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

// Define a model
const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
});

// Create a record
const user = User.create({
  username: 'alice',
  email: 'alice@example.com',
});

console.log(user);
// { id: 1, username: 'alice', email: 'alice@example.com' }

// Query records
const users = User.findAll({
  where: { username: { $like: 'a%' } },
  orderBy: [['username', 'ASC']],
});
```

## API Reference

### ORM Class

#### Constructor

```javascript
const orm = new ORM({
  driver: driverInstance,  // Required: Database driver instance
  config?: driverConfig    // Optional: Driver-specific configuration
});
```

#### Core Methods

##### `define(dbName, tableName, schema)`

Define a model and create its table in the database.

**Parameters:**
- `dbName` (string) - Database name
- `tableName` (string) - Table name
- `schema` (object) - Column definitions

**Returns:** Model instance

```javascript
const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
  age: { type: DataTypes.INTEGER },
  status: { type: DataTypes.TEXT, default: 'active' },
  createdAt: { type: DataTypes.DATETIME },
});
```

**Column Options:**

| Option | Type | Description |
|--------|------|-------------|
| `type` | DataType | Required. Data type from DataTypes enum |
| `primaryKey` | boolean | Mark column as primary key |
| `autoIncrement` | boolean | Auto-increment (INTEGER primary keys only) |
| `notNull` | boolean | NOT NULL constraint |
| `unique` | boolean | UNIQUE constraint |
| `default` | any | Default value for the column |
| `references` | object | Foreign key relationship |

##### `model(dbName, tableName)`

Retrieve an existing model.

```javascript
const User = orm.model('mydb', 'users');
```

##### `table(tableName, dbName?)`

Get a model by table name. Defaults to 'default' database if dbName is omitted.

```javascript
const User = orm.table('users');
const User = orm.table('users', 'mydb');
```

##### `hasModel(dbName, tableName)`

Check if a model exists.

```javascript
if (orm.hasModel('mydb', 'users')) {
  console.log('User model exists');
}
```

##### `getDatabases()`

Get list of all database names.

```javascript
const databases = orm.getDatabases();
console.log(databases); // ['mydb', 'analytics', 'content']
```

##### `disconnect()`

Disconnect the driver and close all connections.

```javascript
orm.disconnect();
```

##### `driverInfo`

Get driver metadata.

```javascript
console.log(orm.driverInfo);
// { name: 'sqlite', version: '1.0.0' }
```

### Model Class

Models provide CRUD operations and queries for database tables.

#### Query Methods

##### `findOne(options)`

Find a single record.

**Parameters:**
- `options.where` - Filter conditions
- `options.select` - Columns to select

**Returns:** Record object or null

```javascript
const user = User.findOne({
  where: { email: 'alice@example.com' },
});
```

##### `findAll(options)`

Find multiple records.

**Parameters:**
- `options.where` - Filter conditions
- `options.orderBy` - Sort order
- `options.limit` - Maximum records to return
- `options.offset` - Number of records to skip
- `options.select` - Columns to select

**Returns:** Array of records

```javascript
const users = User.findAll({
  where: { status: 'active' },
  orderBy: [['createdAt', 'DESC']],
  limit: 10,
  offset: 0,
});
```

##### `findById(id)`

Find record by primary key.

```javascript
const user = User.findById(1);
```

##### `count(where?)`

Count records matching criteria.

```javascript
const total = User.count();
const active = User.count({ status: 'active' });
```

#### Create/Update Methods

##### `create(data)`

Create a new record.

```javascript
const user = User.create({
  username: 'bob',
  email: 'bob@example.com',
  age: 30,
});
```

##### `bulkCreate(records)`

Create multiple records.

```javascript
const users = User.bulkCreate([
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' },
  { username: 'user3', email: 'user3@example.com' },
]);
```

##### `update(data, where)`

Update records matching criteria.

**Returns:** Number of updated records

```javascript
const count = User.update(
  { status: 'verified' },
  { id: 1 }
);
console.log(`Updated ${count} record(s)`);
```

##### `bulkUpdate(updates)`

Update multiple records with different conditions.

```javascript
const count = User.bulkUpdate([
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } },
]);
```

##### `delete(where)`

Delete records matching criteria.

**Returns:** Number of deleted records

```javascript
const count = User.delete({ status: 'deleted' });
console.log(`Deleted ${count} record(s)`);
```

##### `bulkDelete(whereConditions)`

Delete multiple records with different conditions.

```javascript
const count = User.bulkDelete([
  { status: 'deleted' },
  { lastLogin: { $lt: '2020-01-01' } },
]);
```

#### Aggregation Methods

##### `sum(field, where?)`

Sum numeric field values.

```javascript
const totalAge = User.sum('age');
const activeUserAge = User.sum('age', { status: 'active' });
```

##### `avg(field, where?)`

Calculate average of field values.

```javascript
const avgAge = User.avg('age');
```

##### `min(field, where?)`

Find minimum value.

```javascript
const minAge = User.min('age');
```

##### `max(field, where?)`

Find maximum value.

```javascript
const maxAge = User.max('age');
```

#### Index Methods

##### `createIndex(indexName, options)`

Create a database index.

```javascript
User.createIndex('idx_email', {
  columns: ['email'],
  unique: true,
});

User.createIndex('idx_status_created', {
  columns: ['status', 'createdAt'],
});
```

##### `dropIndex(indexName)`

Drop an existing index.

```javascript
User.dropIndex('idx_email');
```

#### Transaction Methods

##### `transaction(fn)`

Execute operations in a transaction. All operations succeed or all fail.

```javascript
User.transaction(() => {
  User.create({ username: 'alice', email: 'alice@example.com' });
  User.create({ username: 'bob', email: 'bob@example.com' });
  User.update({ verified: true }, { username: 'alice' });
  
  // If any operation fails, all changes are rolled back
});
```

## Advanced Usage

### Query Operators

Build complex queries with operators:

```javascript
// Comparison operators
User.findAll({ where: { age: { $gt: 18 } } });                // age > 18
User.findAll({ where: { age: { $gte: 18 } } });               // age >= 18
User.findAll({ where: { age: { $lt: 65 } } });                // age < 65
User.findAll({ where: { age: { $lte: 65 } } });               // age <= 65
User.findAll({ where: { status: { $ne: 'deleted' } } });      // status != 'deleted'

// Set operators
User.findAll({
  where: { status: { $in: ['active', 'pending'] } }
});

User.findAll({
  where: { status: { $notIn: ['deleted', 'banned'] } }
});

// Pattern matching
User.findAll({
  where: { email: { $like: '%@gmail.com' } }
});

// Range queries
User.findAll({
  where: { age: { $between: [18, 65] } }
});

// Complex conditions
User.findAll({
  where: {
    age: { $gte: 18, $lt: 65 },
    status: { $in: ['active', 'verified'] },
    email: { $like: '%@company.com' },
  },
});
```

**Available operators:**

| Operator | Description | Example |
|----------|-------------|---------|
| `$gt` | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 18 } }` |
| `$lt` | Less than | `{ age: { $lt: 65 } }` |
| `$lte` | Less than or equal | `{ age: { $lte: 65 } }` |
| `$ne` | Not equal | `{ status: { $ne: 'deleted' } }` |
| `$in` | In array | `{ status: { $in: ['active', 'pending'] } }` |
| `$notIn` | Not in array | `{ status: { $notIn: ['deleted'] } }` |
| `$like` | Pattern match | `{ email: { $like: '%@gmail.com' } }` |
| `$between` | Between range | `{ age: { $between: [18, 65] } }` |

### TypeScript Support

Full TypeScript support with automatic type inference:

```typescript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
  age: { type: DataTypes.INTEGER },
});

// TypeScript automatically infers types
const user = User.findOne({ where: { id: 1 } });
// user: { id: number; username: string; email: string; age: number } | null

const users = User.findAll();
// users: Array<{ id: number; username: string; email: string; age: number }>
```

### Multiple Databases

Manage multiple databases simultaneously:

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

// Users database
const User = orm.define('users_db', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
});

// Content database
const Post = orm.define('content_db', 'posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT, notNull: true },
  content: { type: DataTypes.TEXT },
});

// Analytics database
const Event = orm.define('analytics_db', 'events', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, notNull: true },
  timestamp: { type: DataTypes.DATETIME },
});

// Creates separate database files:
// ./data/users_db.sqlite
// ./data/content_db.sqlite
// ./data/analytics_db.sqlite
```

## Examples

### Complete CRUD Example

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
  status: { type: DataTypes.TEXT, default: 'active' },
});

// Create
const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
});

// Read
const user = User.findOne({ where: { username: 'alice' } });
const allUsers = User.findAll({ where: { status: 'active' } });

// Update
User.update({ status: 'verified' }, { id: alice.id });

// Delete
User.delete({ status: 'inactive' });

// Count
const total = User.count();
```

### Working with Transactions

```javascript
User.transaction(() => {
  const alice = User.create({
    username: 'alice',
    email: 'alice@example.com',
  });
  
  const bob = User.create({
    username: 'bob',
    email: 'bob@example.com',
  });
  
  User.update({ verified: true }, { id: alice.id });
  
  // All operations succeed together or fail together
});
```

## Driver Examples

### SQLite Driver

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './databases',
    verbose: false,      // SQL query logging
    readonly: false,     // Read-only mode
  }),
});
```

## Best Practices

1. **Use transactions** for multiple related operations
2. **Create indexes** on frequently queried columns
3. **Select specific columns** when you don't need all data
4. **Use bulk operations** instead of loops for better performance
5. **Close connections** properly with `orm.disconnect()`
6. **Handle errors** appropriately in production code

## Related Packages

- **[@rinari/types](https://github.com/OpenUwU/rinari/tree/main/packages/types)** - Type definitions and DataTypes enum
- **[@rinari/sqlite](https://github.com/OpenUwU/rinari/tree/main/packages/sqlite)** - SQLite database driver

## Documentation

- **[Complete Documentation](https://github.com/OpenUwU/rinari/blob/main/docs/README.md)** - Full guides and tutorials
- **[API Documentation](https://github.com/OpenUwU/rinari/tree/main/docs/api/orm)** - Complete API reference
- **[Getting Started](https://github.com/OpenUwU/rinari/blob/main/docs/guide/getting-started.md)** - Quick start guide
- **[Core Concepts](https://github.com/OpenUwU/rinari/blob/main/docs/guide/core-concepts.md)** - Framework fundamentals
- **[Working with Models](https://github.com/OpenUwU/rinari/blob/main/docs/guide/orm/models.md)** - Model operations guide
- **[Examples](https://github.com/OpenUwU/rinari/tree/main/examples)** - Working code examples

## Support

- **[GitHub Issues](https://github.com/OpenUwU/rinari/issues)** - Bug reports and feature requests
- **[Discord Community](https://discord.gg/zqxWVH3CvG)** - Community support and discussions

## License

OpenUwU Open License (OUOL-1.0) - See [LICENSE](https://github.com/OpenUwU/rinari/blob/main/LICENSE) for details.
