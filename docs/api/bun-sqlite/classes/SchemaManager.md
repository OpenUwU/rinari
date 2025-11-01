[**@rinari/bun-sqlite**](../README.md)

***

[@rinari/bun-sqlite](../README.md) / SchemaManager

# Class: SchemaManager

Defined in: [schema.ts:35](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/schema.ts#L35)

Schema manager for creating and managing SQLite tables and indexes using Bun's native SQLite.

## Remarks

Handles DDL (Data Definition Language) operations including table creation,
index management, and schema introspection. Automatically maps Rinari
data types to SQLite types. Optimized for Bun's high-performance execution.

## Example

Basic usage:
```typescript
import { Connection, SchemaManager } from '@rinari/bun-sqlite';
import { DataTypes } from '@rinari/types';

const conn = new Connection({ filepath: './data/app.db' });
const schema = new SchemaManager(conn);

schema.createTable('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true }
});

schema.createIndex('users', 'idx_email', {
  unique: true,
  columns: ['email']
});
```

## Constructors

### Constructor

> **new SchemaManager**(`connection`): `SchemaManager`

Defined in: [schema.ts:47](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/schema.ts#L47)

Creates a new schema manager.

#### Parameters

##### connection

[`Connection`](Connection.md)

Database connection instance

#### Returns

`SchemaManager`

#### Example

```typescript
const conn = new Connection({ filepath: './data/app.db' });
const schema = new SchemaManager(conn);
```

## Methods

### createIndex()

> **createIndex**(`tableName`, `indexName`, `options`): `void`

Defined in: [schema.ts:273](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/schema.ts#L273)

Create an index on specified columns.

#### Parameters

##### tableName

`string`

Table name

##### indexName

`string`

Index name

##### options

`IndexOptions`

Index options

#### Returns

`void`

#### Remarks

Creates the index if it doesn't exist. Indexes improve query performance
on frequently searched columns.

#### Examples

Simple index:
```typescript
schema.createIndex('users', 'idx_email', {
  columns: ['email']
});
```

Unique index:
```typescript
schema.createIndex('users', 'idx_username', {
  unique: true,
  columns: ['username']
});
```

Composite index:
```typescript
schema.createIndex('posts', 'idx_user_date', {
  columns: ['user_id', 'created_at']
});
```

Partial index:
```typescript
schema.createIndex('users', 'idx_active_users', {
  columns: ['created_at'],
  where: "status = 'active'"
});
```

***

### createTable()

> **createTable**(`tableName`, `schema`): `void`

Defined in: [schema.ts:177](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/schema.ts#L177)

Create a new table.

#### Parameters

##### tableName

`string`

Table name

##### schema

`TableSchema`

Table schema definition

#### Returns

`void`

#### Remarks

Creates the table if it doesn't exist. If the table already exists, this operation is a no-op.

#### Examples

Simple table:
```typescript
schema.createTable('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true }
});
```

Table with foreign keys:
```typescript
schema.createTable('posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    notNull: true,
    references: {
      table: 'users',
      column: 'id',
      onDelete: 'CASCADE'
    }
  },
  title: { type: DataTypes.TEXT, notNull: true },
  content: { type: DataTypes.TEXT }
});
```

Table with defaults:
```typescript
schema.createTable('settings', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.TEXT, notNull: true, unique: true },
  value: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, default: true },
  created_at: { type: DataTypes.DATETIME }
});
```

***

### dropIndex()

> **dropIndex**(`indexName`): `void`

Defined in: [schema.ts:295](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/schema.ts#L295)

Drop (delete) an index.

#### Parameters

##### indexName

`string`

Index name

#### Returns

`void`

#### Remarks

Drops the index if it exists. If the index doesn't exist, this operation is a no-op.

#### Example

```typescript
schema.dropIndex('idx_email');
```

***

### dropTable()

> **dropTable**(`tableName`): `void`

Defined in: [schema.ts:202](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/schema.ts#L202)

Drop (delete) a table.

#### Parameters

##### tableName

`string`

Table name

#### Returns

`void`

#### Remarks

Drops the table if it exists. If the table doesn't exist, this operation is a no-op.

#### Example

```typescript
schema.dropTable('old_users');
```

***

### tableExists()

> **tableExists**(`tableName`): `boolean`

Defined in: [schema.ts:221](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/schema.ts#L221)

Check if a table exists.

#### Parameters

##### tableName

`string`

Table name

#### Returns

`boolean`

True if table exists, false otherwise

#### Example

```typescript
if (schema.tableExists('users')) {
  console.log('Users table exists');
} else {
  schema.createTable('users', userSchema);
}
```
