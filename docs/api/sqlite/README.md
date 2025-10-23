**@rinari/sqlite**

***

# @rinari/sqlite

## Remarks

Built on better-sqlite3 with support for multiple database files,
ACID transactions, advanced query operations, and comprehensive index management.

Key features:
- Synchronous and fast (built on better-sqlite3)
- Multi-database support (manage multiple SQLite files)
- ACID transactions with automatic rollback
- Advanced query operators ($gt, $lt, $in, $like, $between, etc.)
- Index creation and management
- WAL mode for better performance
- Comprehensive aggregation support

## Example

Basic usage:
```typescript
import { SQLiteDriver } from '@rinari/sqlite';
import { ORM } from '@rinari/orm';
import { DataTypes } from '@rinari/types';

const driver = new SQLiteDriver({
  storageDir: './data'
});

const orm = new ORM({ driver });

const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true }
});

const user = User.create({
  username: 'alice',
  email: 'alice@example.com'
});
```

## Classes

- [Connection](classes/Connection.md)
- [QueryBuilder](classes/QueryBuilder.md)
- [SchemaManager](classes/SchemaManager.md)
- [SQLiteDriver](classes/SQLiteDriver.md)

## Interfaces

- [ConnectionOptions](interfaces/ConnectionOptions.md)
