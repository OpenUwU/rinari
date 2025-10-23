# SQLite Driver Guide

Complete guide to using the @rinari/sqlite driver.

## Installation

```bash
npm install @rinari/sqlite @rinari/orm
```

## Basic Setup

```typescript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});
```

## Configuration Options

### Basic Configuration

```typescript
const driver = new SQLiteDriver({
  storageDir: './databases', // Required: directory for SQLite files
});
```

### With Logging

```typescript
const driver = new SQLiteDriver({
  storageDir: './data',
  verbose: true, // Log all SQL statements
});
```

### Read-Only Mode

```typescript
const driver = new SQLiteDriver({
  storageDir: './data',
  readonly: true, // Database cannot be modified
});
```

## Features

### WAL Mode

The driver automatically enables Write-Ahead Logging (WAL) mode for better
concurrency:

- Multiple readers can access the database simultaneously
- Readers don't block writers
- Better performance for write-heavy workloads

### ACID Transactions

Full transaction support with automatic rollback:

```typescript
User.transaction(() => {
  const user = User.create({ username: 'alice' });
  Profile.create({ userId: user.id });
  return user;
});
```

### Multi-Database Support

Manage multiple SQLite files:

```typescript
const User = orm.define('users_db', 'users', schema);
const Post = orm.define('content_db', 'posts', schema);

// Creates:
// ./data/users_db.sqlite
// ./data/content_db.sqlite
```

### Query Operators

Advanced query operators for complex filtering:

```typescript
User.findAll({
  where: {
    age: { $gte: 18, $lt: 65 },
    role: { $in: ['admin', 'moderator'] },
    username: { $like: '%john%' },
    status: { $ne: 'banned' },
    score: { $between: [0, 100] },
  },
});
```

## Performance Optimization

### Indexes

Create indexes on frequently queried columns:

```typescript
User.createIndex('idx_email', {
  unique: true,
  columns: ['email'],
});

User.createIndex('idx_status_created', {
  columns: ['status', 'createdAt'],
});
```

### Bulk Operations

Use bulk operations instead of loops:

```typescript
// ✓ Good: Single transaction
const users = User.bulkCreate([
  { username: 'user1' },
  { username: 'user2' },
  { username: 'user3' },
]);

// ✗ Bad: Multiple transactions
for (const data of userData) {
  User.create(data);
}
```

### Field Selection

Only select fields you need:

```typescript
User.findAll({
  select: ['id', 'username', 'email'],
});
```

### Pagination

Limit results for large datasets:

```typescript
User.findAll({
  limit: 100,
  offset: 0,
});
```

## Advanced Features

### Direct Connection Access

Access the underlying better-sqlite3 connection:

```typescript
const conn = driver.getConnectionForDb('default');

// Vacuum database
conn.vacuum();

// Analyze for query optimization
conn.analyze();

// Checkpoint WAL
conn.checkpoint('TRUNCATE');

// Get memory usage
const { used, highwater } = conn.memory;
console.log(`DB size: ${(used / 1024 / 1024).toFixed(2)} MB`);
```

### Raw SQL

Execute raw SQL when needed:

```typescript
const conn = driver.getConnectionForDb('default');

conn.exec(`
  CREATE VIRTUAL TABLE fts USING fts5(content);
  INSERT INTO fts VALUES ('Hello World');
`);

const results = conn
  .prepare('SELECT * FROM fts WHERE fts MATCH ?')
  .all('Hello');
```

## Data Type Mapping

| Rinari Type | SQLite Type | Notes           |
| ------------ | ----------- | --------------- |
| INTEGER      | INTEGER     | Whole numbers   |
| TEXT         | TEXT        | Strings         |
| REAL         | REAL        | Floating point  |
| BOOLEAN      | INTEGER     | Stored as 0/1   |
| DATE         | TEXT        | ISO 8601 format |
| DATETIME     | TEXT        | ISO 8601 format |
| JSON         | TEXT        | Serialized JSON |
| BLOB         | BLOB        | Binary data     |

## Best Practices

1. **Use Transactions**

   ```typescript
   User.transaction(() => {
     // Multiple related operations
   });
   ```

2. **Create Indexes**

   ```typescript
   User.createIndex('idx_email', { unique: true, columns: ['email'] });
   ```

3. **Cleanup Connections**

   ```typescript
   try {
     // ... use ORM
   } finally {
     orm.disconnect();
   }
   ```

4. **Handle Errors**
   ```typescript
   try {
     User.create(data);
   } catch (error) {
     if (error.message.includes('UNIQUE constraint')) {
       // Handle duplicate
     }
   }
   ```

## Troubleshooting

### Database Locked

If you see "database is locked" errors:

1. WAL mode is enabled by default (helps prevent locks)
2. Avoid long-running transactions
3. Call `orm.disconnect()` when done

### Performance Issues

1. Create indexes on filtered columns
2. Use bulk operations
3. Enable WAL mode (default)
4. Select only needed fields

### Installation Issues

If better-sqlite3 fails to install:

```bash
# Rebuild native module
npm rebuild better-sqlite3

# Or for Bun
bun add better-sqlite3
```

## Bun Runtime

When using Bun, you'll see a warning:

```
⚠️  WARNING: You are using @rinari/sqlite with Bun runtime.
   bun support is experimental
```

The driver works with Bun but is optimized for Node.js.

## Next Steps

- [Models Guide](../orm/models.md)
- [Driver Overview](./overview.md)
- [API Documentation](../../api/README.md)
