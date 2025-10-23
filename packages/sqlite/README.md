
# @rinari/sqlite

High-performance synchronous SQLite driver for @rinari/orm.

[![npm version](https://img.shields.io/npm/v/@rinari/sqlite.svg?style=for-the-badge&)](https://www.npmjs.com/package/@rinari/sqlite)
[![License](https://img.shields.io/badge/license-OUOL--1.0-blue.svg?style=for-the-badge&)](https://github.com/OpenUwU/rinari/blob/main/LICENSE)

## Overview

`@rinari/sqlite` is a SQLite driver for Rinari ORM, built on better-sqlite3 for maximum performance. It provides synchronous operations, multi-database support, ACID transactions, and advanced query capabilities.

## Features

- **High Performance** - Built on better-sqlite3 for synchronous, fast operations
- **Multi-Database** - Manage multiple SQLite files simultaneously
- **ACID Transactions** - Full transaction support with automatic rollback
- **Advanced Queries** - Complex WHERE clauses with rich operator support
- **Type-Safe** - Full TypeScript support with type inference
- **Query Operators** - Comparison, set, pattern matching, and range operators
- **Indexes** - Create and manage database indexes for performance
- **WAL Mode** - Write-Ahead Logging enabled by default for better concurrency

## Prerequisites

- **Node.js >= 18.0.0** or **Bun >= 1.0.0**
- **@rinari/orm** (required peer dependency)

## Installation

```bash
npm install @rinari/sqlite @rinari/orm
```

## Quick Start

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

// Initialize ORM with SQLite driver
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

// Define a model
const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
  age: { type: DataTypes.INTEGER },
});

// Create a record
const user = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
});

console.log(user);
// { id: 1, username: 'alice', email: 'alice@example.com', age: 25 }

// Query records
const users = User.findAll({
  where: { age: { $gte: 18 } },
  orderBy: [['username', 'ASC']],
});
```

## Configuration

### Driver Options

The SQLiteDriver constructor accepts a configuration object:

```javascript
const driver = new SQLiteDriver({
  storageDir: './databases',  // Required: Directory for database files
  verbose: false,             // Optional: Enable SQL query logging
  readonly: false,            // Optional: Open databases in read-only mode
});
```

**Configuration Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageDir` | string | required | Directory where SQLite database files are stored |
| `verbose` | boolean | `false` | Enable SQL query logging to console |
| `readonly` | boolean | `false` | Open databases in read-only mode |

### Configuration Examples

**Basic Configuration:**

```javascript
const driver = new SQLiteDriver({
  storageDir: './data',
});
```

**With Verbose Logging:**

```javascript
const driver = new SQLiteDriver({
  storageDir: './data',
  verbose: true,  // Logs all SQL queries to console
});
```

**Read-Only Mode:**

```javascript
const driver = new SQLiteDriver({
  storageDir: './data',
  readonly: true,  // No write operations allowed
});
```

## Usage Guide

### Basic CRUD Operations

```javascript
import { DataTypes } from '@rinari/types';

const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
  status: { type: DataTypes.TEXT, default: 'active' },
});

// Create
const user = User.create({
  username: 'bob',
  email: 'bob@example.com',
  status: 'active',
});

// Read - Find one
const foundUser = User.findOne({
  where: { username: 'bob' },
});

// Read - Find all
const allUsers = User.findAll({
  where: { status: 'active' },
  orderBy: [['username', 'ASC']],
  limit: 10,
});

// Read - Find by ID
const userById = User.findById(1);

// Update
const updatedCount = User.update(
  { status: 'inactive' },
  { username: 'bob' }
);
console.log(`Updated ${updatedCount} record(s)`);

// Delete
const deletedCount = User.delete({ status: 'inactive' });
console.log(`Deleted ${deletedCount} record(s)`);

// Count
const totalUsers = User.count();
const activeUsers = User.count({ status: 'active' });
```

### Query Operators

Build powerful queries with operators:

```javascript
// Comparison operators
const adults = User.findAll({
  where: { age: { $gte: 18 } },
});

const seniors = User.findAll({
  where: { age: { $gt: 65 } },
});

const young = User.findAll({
  where: { age: { $lt: 30 } },
});

// Set operators
const specificUsers = User.findAll({
  where: {
    username: { $in: ['alice', 'bob', 'charlie'] },
  },
});

const excludedUsers = User.findAll({
  where: {
    status: { $notIn: ['deleted', 'banned'] },
  },
});

// Pattern matching
const gmailUsers = User.findAll({
  where: {
    email: { $like: '%@gmail.com' },
  },
});

// Not equal
const activeUsers = User.findAll({
  where: {
    status: { $ne: 'deleted' },
  },
});

// Range queries
const midAgeUsers = User.findAll({
  where: {
    age: { $between: [25, 35] },
  },
});

// Complex multi-condition queries
const filtered = User.findAll({
  where: {
    age: { $gte: 18, $lt: 65 },
    status: { $in: ['active', 'verified'] },
    email: { $like: '%@company.com' },
  },
});
```

**Available Operators:**

| Operator | SQL Equivalent | Description | Example |
|----------|---------------|-------------|---------|
| `$gt` | `>` | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | `>=` | Greater than or equal | `{ age: { $gte: 18 } }` |
| `$lt` | `<` | Less than | `{ age: { $lt: 65 } }` |
| `$lte` | `<=` | Less than or equal | `{ age: { $lte: 65 } }` |
| `$ne` | `!=` | Not equal | `{ status: { $ne: 'deleted' } }` |
| `$in` | `IN (...)` | In array | `{ status: { $in: ['active', 'pending'] } }` |
| `$notIn` | `NOT IN (...)` | Not in array | `{ status: { $notIn: ['deleted'] } }` |
| `$like` | `LIKE` | Pattern match | `{ email: { $like: '%@gmail.com' } }` |
| `$between` | `BETWEEN ... AND ...` | Between range (inclusive) | `{ age: { $between: [18, 65] } }` |

### Bulk Operations

Perform multiple operations efficiently:

```javascript
// Bulk create - insert multiple records at once
const users = User.bulkCreate([
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' },
  { username: 'user3', email: 'user3@example.com' },
]);

// Bulk update - update multiple records with different conditions
const updatedCount = User.bulkUpdate([
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } },
  { where: { id: 3 }, data: { status: 'verified' } },
]);

// Bulk delete - delete multiple records with different conditions
const deletedCount = User.bulkDelete([
  { status: 'deleted' },
  { lastLogin: { $lt: '2020-01-01' } },
]);
```

### Aggregation Functions

Calculate statistics from your data:

```javascript
// Sum
const totalAge = User.sum('age');
const activeUserAge = User.sum('age', { status: 'active' });

// Average
const avgAge = User.avg('age');
const avgActiveAge = User.avg('age', { status: 'active' });

// Minimum
const minAge = User.min('age');

// Maximum
const maxAge = User.max('age');

// Combined example
console.log(`Age statistics:`);
console.log(`  Range: ${minAge} - ${maxAge}`);
console.log(`  Average: ${avgAge.toFixed(1)}`);
console.log(`  Total: ${totalAge}`);
```

### Transactions

Ensure data integrity with ACID transactions:

```javascript
User.transaction(() => {
  // All operations inside succeed together or fail together
  User.create({ username: 'alice', email: 'alice@example.com' });
  User.create({ username: 'bob', email: 'bob@example.com' });
  User.update({ verified: true }, { username: 'alice' });
  
  // If any operation fails, all changes are automatically rolled back
});
```

### Database Indexes

Improve query performance with indexes:

```javascript
// Simple index on single column
User.createIndex('idx_email', {
  columns: ['email'],
  unique: true,
});

// Composite index on multiple columns
User.createIndex('idx_status_created', {
  columns: ['status', 'createdAt'],
});

// Non-unique index
User.createIndex('idx_age', {
  columns: ['age'],
});

// Drop an index when no longer needed
User.dropIndex('idx_email');
```

### Multiple Databases

Manage multiple SQLite databases in one application:

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

// Creates separate SQLite files:
// ./data/users_db.sqlite
// ./data/content_db.sqlite
// ./data/analytics_db.sqlite
```

## Data Type Mapping

SQLite driver maps Rinari data types to SQLite types:

| Rinari Type | SQLite Type | JavaScript Type | Example |
|--------------|-------------|-----------------|---------|
| `DataTypes.INTEGER` | INTEGER | number | `42` |
| `DataTypes.TEXT` | TEXT | string | `'hello'` |
| `DataTypes.REAL` | REAL | number | `3.14` |
| `DataTypes.BLOB` | BLOB | Buffer | `Buffer.from('data')` |
| `DataTypes.BOOLEAN` | INTEGER | boolean | `true` (stored as 1/0) |
| `DataTypes.DATE` | TEXT | string | `'2024-01-15'` |
| `DataTypes.DATETIME` | TEXT | string | `'2024-01-15T10:30:00Z'` |
| `DataTypes.JSON` | TEXT | object/array | `{ key: 'value' }` |

## TypeScript Support

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
  createdAt: { type: DataTypes.DATETIME },
});

// TypeScript automatically infers the correct types
const user = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
});
// user: { id: number; username: string; email: string; age: number; createdAt: string }

const users = User.findAll();
// users: Array<{ id: number; username: string; email: string; age: number; createdAt: string }>
```

## Performance

This driver uses better-sqlite3, which is significantly faster than asynchronous SQLite libraries for typical workloads:

- **Synchronous operations** - No async overhead
- **WAL mode** - Write-Ahead Logging for better concurrency
- **Prepared statements** - Automatic statement caching
- **Efficient bulk operations** - Optimized for batch processing

## Bun Runtime Support

When using Bun, you may see a warning:

```
WARNING: You are using @rinari/sqlite with Bun runtime.
Bun support is experimental.
```

This is informational. The driver works with Bun, but better-sqlite3 is optimized for Node.js.

## Best Practices

1. **Use transactions** for multiple related writes
2. **Create indexes** on columns used in WHERE clauses and JOINs
3. **Use bulk operations** instead of loops for better performance
4. **Select specific columns** when you don't need all data
5. **Close connections** properly with `orm.disconnect()`
6. **Enable WAL mode** (enabled by default) for better concurrency
7. **Handle errors** appropriately in production code

## Troubleshooting

### Installation Issues

If better-sqlite3 fails to install:

```bash
# For Node.js - rebuild native module
npm rebuild better-sqlite3

# For Bun - reinstall package
bun add better-sqlite3
```

### Database Locked Errors

If you encounter "database is locked" errors:

1. **WAL mode is enabled by default** - This should prevent most locking issues
2. **Avoid long-running transactions** - Keep transactions short
3. **Close unused connections** - Call `orm.disconnect()` when done
4. **Don't share database files** across processes without proper locking

### Performance Issues

To improve performance:

1. **Use bulk operations** instead of individual creates/updates in loops
2. **Create indexes** on frequently queried columns
3. **Use transactions** for multiple write operations
4. **WAL mode** is enabled by default for better performance
5. **Analyze queries** with `verbose: true` to see generated SQL

## Related Packages

- **[@rinari/orm](https://github.com/OpenUwU/rinari/tree/main/packages/orm)** - Core ORM (required)
- **[@rinari/types](https://github.com/OpenUwU/rinari/tree/main/packages/types)** - Type definitions

## Documentation

- **[API Documentation](https://github.com/OpenUwU/rinari/tree/main/docs/api/sqlite)** - Complete API reference
- **[SQLite Driver Guide](https://github.com/OpenUwU/rinari/blob/main/docs/guide/driver/sqlite.md)** - Comprehensive SQLite driver guide
- **[Driver Overview](https://github.com/OpenUwU/rinari/blob/main/docs/guide/driver/overview.md)** - Driver system architecture
- **[Complete Documentation](https://github.com/OpenUwU/rinari/blob/main/docs/README.md)** - Full documentation hub

## Support

- **[GitHub Issues](https://github.com/OpenUwU/rinari/issues)** - Bug reports and feature requests
- **[Discord Community](https://discord.gg/zqxWVH3CvG)** - Community support and discussions

## License

OpenUwU Open License (OUOL-1.0) - See [LICENSE](https://github.com/OpenUwU/rinari/blob/main/LICENSE) for details.
