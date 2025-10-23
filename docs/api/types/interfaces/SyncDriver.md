[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / SyncDriver

# Interface: SyncDriver

Defined in: [driver.ts:472](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L472)

Synchronous driver interface.

## Remarks

All operations return values directly without Promises.
Suitable for SQLite and other synchronous backends.

## Example

```typescript
import { SyncDriver } from '@rinari/types';

const driver: SyncDriver = new SQLiteDriver(config);
const user = driver.findOne('main', 'users', { where: { id: 1 } });
console.log(user); // No await needed
```

## Extends

- [`Driver`](Driver.md)

## Properties

### metadata

> `readonly` **metadata**: [`DriverMetadata`](DriverMetadata.md)

Defined in: [driver.ts:126](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L126)

Driver metadata (name, version).

#### Inherited from

[`Driver`](Driver.md).[`metadata`](Driver.md#metadata)

## Methods

### aggregate()?

> `optional` **aggregate**(`dbName`, `tableName`, `operation`, `field`, `where?`): `number` \| `Promise`\<`number`\>

Defined in: [driver.ts:445](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L445)

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

`number` \| `Promise`\<`number`\>

Aggregation result

#### Example

```typescript
const totalAge = driver.aggregate('main', 'users', 'SUM', 'age');
const avgAge = driver.aggregate('main', 'users', 'AVG', 'age', {
  status: 'active'
});
```

#### Inherited from

[`Driver`](Driver.md).[`aggregate`](Driver.md#aggregate)

***

### bulkInsert()

> **bulkInsert**\<`T`\>(`dbName`, `tableName`, `records`): `T`[]

Defined in: [driver.ts:482](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L482)

Insert multiple records in a single operation.

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
const users = driver.bulkInsert<User>('main', 'users', [
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' }
]);
```

#### Overrides

[`Driver`](Driver.md).[`bulkInsert`](Driver.md#bulkinsert)

***

### bulkUpdate()

> **bulkUpdate**(`dbName`, `tableName`, `updates`): `number`

Defined in: [driver.ts:489](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L489)

Perform multiple updates in a single operation.

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
const updated = driver.bulkUpdate('main', 'users', [
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } }
]);
```

#### Overrides

[`Driver`](Driver.md).[`bulkUpdate`](Driver.md#bulkupdate)

***

### connect()

> **connect**(`config`): `void`

Defined in: [driver.ts:473](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L473)

Establish database connection.

#### Parameters

##### config

[`DriverConfig`](DriverConfig.md)

Driver configuration

#### Returns

`void`

#### Example

```typescript
driver.connect({
  storageDir: './data',
  verbose: true
});
```

#### Overrides

[`Driver`](Driver.md).[`connect`](Driver.md#connect)

***

### count()

> **count**(`dbName`, `tableName`, `where?`): `number`

Defined in: [driver.ts:480](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L480)

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

Filter conditions

#### Returns

`number`

Number of matching records

#### Example

```typescript
const count = driver.count('main', 'users', {
  status: 'active'
});
console.log(`${count} active users`);
```

#### Overrides

[`Driver`](Driver.md).[`count`](Driver.md#count)

***

### createIndex()

> **createIndex**(`dbName`, `tableName`, `indexName`, `options`): `void`

Defined in: [driver.ts:495](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L495)

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

[`IndexOptions`](IndexOptions.md)

Index options

#### Returns

`void`

#### Example

```typescript
driver.createIndex('main', 'users', 'idx_email', {
  unique: true,
  columns: ['email']
});
```

#### Overrides

[`Driver`](Driver.md).[`createIndex`](Driver.md#createindex)

***

### createTable()

> **createTable**(`dbName`, `tableName`, `schema`): `void`

Defined in: [driver.ts:475](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L475)

Create a new table with the specified schema.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

##### schema

[`TableSchema`](TableSchema.md)

Table schema definition

#### Returns

`void`

#### Example

```typescript
driver.createTable('main', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true }
});
```

#### Overrides

[`Driver`](Driver.md).[`createTable`](Driver.md#createtable)

***

### delete()

> **delete**(`dbName`, `tableName`, `where`): `number`

Defined in: [driver.ts:494](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L494)

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
const deleted = driver.delete('main', 'users', {
  status: 'banned'
});
console.log(`${deleted} users removed`);
```

#### Overrides

[`Driver`](Driver.md).[`delete`](Driver.md#delete)

***

### disconnect()

> **disconnect**(): `void`

Defined in: [driver.ts:474](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L474)

Close database connection and cleanup resources.

#### Returns

`void`

#### Example

```typescript
await driver.disconnect();
```

#### Overrides

[`Driver`](Driver.md).[`disconnect`](Driver.md#disconnect)

***

### dropIndex()

> **dropIndex**(`dbName`, `tableName`, `indexName`): `void`

Defined in: [driver.ts:496](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L496)

Drop (delete) an index.

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

#### Returns

`void`

#### Example

```typescript
driver.dropIndex('main', 'users', 'idx_email');
```

#### Overrides

[`Driver`](Driver.md).[`dropIndex`](Driver.md#dropindex)

***

### dropTable()

> **dropTable**(`dbName`, `tableName`): `void`

Defined in: [driver.ts:476](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L476)

Drop (delete) a table.

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
driver.dropTable('main', 'old_users');
```

#### Overrides

[`Driver`](Driver.md).[`dropTable`](Driver.md#droptable)

***

### findAll()

> **findAll**\<`T`\>(`dbName`, `tableName`, `options`): `T`[]

Defined in: [driver.ts:479](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L479)

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

[`QueryOptions`](QueryOptions.md)

Query options

#### Returns

`T`[]

Array of matching records

#### Example

```typescript
const adults = driver.findAll<User>('main', 'users', {
  where: { age: { $gte: 18 } },
  orderBy: [['age', 'ASC']],
  limit: 10
});
```

#### Overrides

[`Driver`](Driver.md).[`findAll`](Driver.md#findall)

***

### findOne()

> **findOne**\<`T`\>(`dbName`, `tableName`, `options`): `T` \| `null`

Defined in: [driver.ts:478](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L478)

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

[`QueryOptions`](QueryOptions.md)

Query options

#### Returns

`T` \| `null`

Matching record or null

#### Example

```typescript
const user = driver.findOne<User>('main', 'users', {
  where: { username: 'alice' }
});
```

#### Overrides

[`Driver`](Driver.md).[`findOne`](Driver.md#findone)

***

### insert()

> **insert**\<`T`\>(`dbName`, `tableName`, `data`): `T`

Defined in: [driver.ts:481](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L481)

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
const user = driver.insert<User>('main', 'users', {
  username: 'alice',
  email: 'alice@example.com',
  age: 25
});
console.log(user.id); // Generated ID
```

#### Overrides

[`Driver`](Driver.md).[`insert`](Driver.md#insert)

***

### tableExists()

> **tableExists**(`dbName`, `tableName`): `boolean`

Defined in: [driver.ts:477](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L477)

Check if a table exists.

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
if (driver.tableExists('main', 'users')) {
  console.log('Users table exists');
}
```

#### Overrides

[`Driver`](Driver.md).[`tableExists`](Driver.md#tableexists)

***

### transaction()

> **transaction**\<`T`\>(`fn`): `T`

Defined in: [driver.ts:497](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L497)

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
  const user = driver.insert('main', 'users', { username: 'alice' });
  driver.insert('main', 'profiles', { user_id: user.id, bio: 'Hello' });
  return user;
});
```

#### Overrides

[`Driver`](Driver.md).[`transaction`](Driver.md#transaction)

***

### update()

> **update**(`dbName`, `tableName`, `data`, `where`): `number`

Defined in: [driver.ts:483](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L483)

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
const updated = driver.update('main', 'users',
  { status: 'inactive' },
  { last_login: { $lt: '2024-01-01' } }
);
console.log(`${updated} users deactivated`);
```

#### Overrides

[`Driver`](Driver.md).[`update`](Driver.md#update)
