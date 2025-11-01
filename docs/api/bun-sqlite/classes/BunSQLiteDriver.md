[**@rinari/bun-sqlite**](../README.md)

***

[@rinari/bun-sqlite](../README.md) / BunSQLiteDriver

# Class: BunSQLiteDriver

Defined in: [driver.ts:70](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L70)

Synchronous Bun-native SQLite driver for Rinari ORM.

## Remarks

High-performance SQLite driver built on Bun's native `bun:sqlite` module with support for:
- 3-6x faster than better-sqlite3
- Multiple database files
- ACID transactions
- Advanced query operators
- Index management
- WAL mode for better concurrency

**Requirements:** This driver requires the Bun runtime (>=1.0.0). It will not work with Node.js.

## Examples

Basic usage:
```typescript
import { BunSQLiteDriver } from '@rinari/bun-sqlite';
import { ORM } from '@rinari/orm';
import { DataTypes } from '@rinari/types';

const driver = new BunSQLiteDriver({
  storageDir: './data',
  verbose: false
});

const orm = new ORM({ driver });

const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true }
});

const user = User.create({
  username: 'alice',
  email: 'alice@example.com'
});
```

Multi-database setup:
```typescript
const driver = new BunSQLiteDriver({
  storageDir: './data'
});

const orm = new ORM({ driver });

const User = orm.define('users_db', 'users', userSchema);
const Product = orm.define('products_db', 'products', productSchema);

console.log('Databases:', orm.getDatabases()); // ['users_db', 'products_db']
```

## Implements

- `SyncDriver`

## Constructors

### Constructor

> **new BunSQLiteDriver**(`config`): `BunSQLiteDriver`

Defined in: [driver.ts:105](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L105)

Creates a new Bun SQLite driver instance.

#### Parameters

##### config

`DriverConfig`

Driver configuration

#### Returns

`BunSQLiteDriver`

#### Throws

If not running in Bun runtime

#### Remarks

The driver will create database files in the specified storage directory.
Each database name maps to a separate .sqlite file.

#### Example

```typescript
const driver = new BunSQLiteDriver({
  storageDir: './data',
  verbose: true,
  readonly: false
});
```

## Properties

### metadata

> `readonly` **metadata**: `DriverMetadata`

Defined in: [driver.ts:74](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L74)

Driver metadata.

#### Implementation of

`SyncDriver.metadata`

## Methods

### aggregate()

> **aggregate**(`dbName`, `tableName`, `operation`, `field`, `where?`): `number`

Defined in: [driver.ts:543](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L543)

Perform an aggregation operation.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### operation

`string`

Aggregation operation (SUM, AVG, MIN, MAX, COUNT)

##### field

`string`

Field to aggregate

##### where?

`Record`\<`string`, `any`\>

Optional filter conditions

#### Returns

`number`

Aggregation result

#### Example

```typescript
const totalAge = driver.aggregate('default', 'users', 'SUM', 'age');
const avgAge = driver.aggregate('default', 'users', 'AVG', 'age', {
  status: 'active'
});
```

#### Implementation of

`SyncDriver.aggregate`

***

### bulkInsert()

> **bulkInsert**\<`T`\>(`dbName`, `tableName`, `records`): `T`[]

Defined in: [driver.ts:384](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L384)

Insert multiple records in a single transaction.

#### Type Parameters

##### T

`T` = `any`

Expected return type

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### records

`Record`\<`string`, `any`\>[]

Array of records to insert

#### Returns

`T`[]

Array of inserted records with generated IDs

#### Example

```typescript
const users = driver.bulkInsert<User>('default', 'users', [
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' }
]);
```

#### Implementation of

`SyncDriver.bulkInsert`

***

### bulkUpdate()

> **bulkUpdate**(`dbName`, `tableName`, `updates`): `number`

Defined in: [driver.ts:432](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L432)

Perform multiple updates in a single transaction.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### updates

`object`[]

Array of update operations

#### Returns

`number`

Total number of updated records

#### Example

```typescript
const updated = driver.bulkUpdate('default', 'users', [
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } }
]);
```

#### Implementation of

`SyncDriver.bulkUpdate`

***

### connect()

> **connect**(`config`): `void`

Defined in: [driver.ts:134](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L134)

Connect to the database(s).

#### Parameters

##### config

`DriverConfig`

Driver configuration

#### Returns

`void`

#### Remarks

This method updates the configuration. Actual database connections
are created lazily when they're first accessed.

#### Example

```typescript
driver.connect({
  storageDir: './data',
  verbose: true
});
```

#### Implementation of

`SyncDriver.connect`

***

### count()

> **count**(`dbName`, `tableName`, `where?`): `number`

Defined in: [driver.ts:340](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L340)

Count records matching the where condition.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### where?

`Record`\<`string`, `any`\>

Optional filter conditions

#### Returns

`number`

Number of matching records

#### Example

```typescript
const count = driver.count('default', 'users', { status: 'active' });
```

#### Implementation of

`SyncDriver.count`

***

### createIndex()

> **createIndex**(`dbName`, `tableName`, `indexName`, `options`): `void`

Defined in: [driver.ts:475](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L475)

Create an index on specified columns.

#### Parameters

##### dbName

`string`

Database name

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

#### Example

```typescript
driver.createIndex('default', 'users', 'idx_email', {
  unique: true,
  columns: ['email']
});
```

#### Implementation of

`SyncDriver.createIndex`

***

### createTable()

> **createTable**(`dbName`, `tableName`, `schema`): `void`

Defined in: [driver.ts:243](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L243)

Create a new table in the specified database.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### schema

`TableSchema`

Table schema definition

#### Returns

`void`

#### Example

```typescript
driver.createTable('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true }
});
```

#### Implementation of

`SyncDriver.createTable`

***

### delete()

> **delete**(`dbName`, `tableName`, `where`): `number`

Defined in: [driver.ts:454](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L454)

Delete records matching the where condition.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### where

`Record`\<`string`, `any`\>

Filter conditions

#### Returns

`number`

Number of deleted records

#### Example

```typescript
const deleted = driver.delete('default', 'users', { status: 'banned' });
```

#### Implementation of

`SyncDriver.delete`

***

### disconnect()

> **disconnect**(): `void`

Defined in: [driver.ts:219](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L219)

Disconnect from all databases and cleanup resources.

#### Returns

`void`

#### Remarks

Always call this method when you're done using the driver to prevent
resource leaks and ensure proper database file closure.

#### Example

```typescript
try {
  // ... use driver
} finally {
  driver.disconnect();
}
```

#### Implementation of

`SyncDriver.disconnect`

***

### dropIndex()

> **dropIndex**(`dbName`, `tableName`, `indexName`): `void`

Defined in: [driver.ts:492](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L492)

Drop an index.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name (unused in SQLite)

##### indexName

`string`

Index name

#### Returns

`void`

#### Example

```typescript
driver.dropIndex('default', 'users', 'idx_email');
```

#### Implementation of

`SyncDriver.dropIndex`

***

### dropTable()

> **dropTable**(`dbName`, `tableName`): `void`

Defined in: [driver.ts:259](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L259)

Drop a table from the specified database.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

`void`

#### Example

```typescript
driver.dropTable('default', 'old_users');
```

#### Implementation of

`SyncDriver.dropTable`

***

### findAll()

> **findAll**\<`T`\>(`dbName`, `tableName`, `options`): `T`[]

Defined in: [driver.ts:322](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L322)

Find all records matching the query options.

#### Type Parameters

##### T

`T` = `any`

Expected return type

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### options

`QueryOptions`

Query options

#### Returns

`T`[]

Array of matching records

#### Example

```typescript
const users = driver.findAll<User>('default', 'users', {
  where: { age: { $gte: 18 } },
  orderBy: [['age', 'ASC']],
  limit: 10
});
```

#### Implementation of

`SyncDriver.findAll`

***

### findOne()

> **findOne**\<`T`\>(`dbName`, `tableName`, `options`): `T` \| `null`

Defined in: [driver.ts:299](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L299)

Find a single record matching the query options.

#### Type Parameters

##### T

`T` = `any`

Expected return type

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### options

`QueryOptions`

Query options

#### Returns

`T` \| `null`

Matching record or null

#### Example

```typescript
const user = driver.findOne<User>('default', 'users', {
  where: { username: 'alice' }
});
```

#### Implementation of

`SyncDriver.findOne`

***

### getConnectionForDb()

> **getConnectionForDb**(`dbName`): [`Connection`](Connection.md)

Defined in: [driver.ts:570](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L570)

Get the connection instance for a specific database.

#### Parameters

##### dbName

`string`

Database name

#### Returns

[`Connection`](Connection.md)

Connection instance

#### Remarks

Use this to access lower-level database operations or Bun SQLite features.

#### Example

```typescript
const conn = driver.getConnectionForDb('default');
conn.vacuum();
conn.analyze();
```

***

### insert()

> **insert**\<`T`\>(`dbName`, `tableName`, `data`): `T`

Defined in: [driver.ts:362](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L362)

Insert a new record.

#### Type Parameters

##### T

`T` = `any`

Expected return type

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### data

`Record`\<`string`, `any`\>

Record data

#### Returns

`T`

Inserted record with generated ID

#### Example

```typescript
const user = driver.insert<User>('default', 'users', {
  username: 'alice',
  email: 'alice@example.com'
});
```

#### Implementation of

`SyncDriver.insert`

***

### tableExists()

> **tableExists**(`dbName`, `tableName`): `boolean`

Defined in: [driver.ts:278](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L278)

Check if a table exists in the specified database.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

`boolean`

True if table exists, false otherwise

#### Example

```typescript
if (driver.tableExists('default', 'users')) {
  console.log('Users table exists');
}
```

#### Implementation of

`SyncDriver.tableExists`

***

### transaction()

> **transaction**\<`T`\>(`fn`): `T`

Defined in: [driver.ts:517](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L517)

Execute a transaction.

#### Type Parameters

##### T

`T`

Transaction return type

#### Parameters

##### fn

() => `T`

Transaction callback

#### Returns

`T`

Transaction result

#### Remarks

All operations in the callback execute atomically.
If an error occurs, all changes are rolled back.

#### Example

```typescript
const result = driver.transaction(() => {
  const user = driver.insert('default', 'users', { username: 'alice' });
  driver.insert('default', 'profiles', { user_id: user.id, bio: 'Hello' });
  return user;
});
```

#### Implementation of

`SyncDriver.transaction`

***

### update()

> **update**(`dbName`, `tableName`, `data`, `where`): `number`

Defined in: [driver.ts:406](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/driver.ts#L406)

Update records matching the where condition.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### data

`Record`\<`string`, `any`\>

New values

##### where

`Record`\<`string`, `any`\>

Filter conditions

#### Returns

`number`

Number of updated records

#### Example

```typescript
const updated = driver.update('default', 'users',
  { status: 'inactive' },
  { last_login: { $lt: '2024-01-01' } }
);
```

#### Implementation of

`SyncDriver.update`
