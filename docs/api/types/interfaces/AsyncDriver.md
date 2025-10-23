[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / AsyncDriver

# Interface: AsyncDriver

Defined in: [driver.ts:518](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L518)

Asynchronous driver interface.

## Remarks

All operations return Promises.
Suitable for MongoDB and other asynchronous backends.

## Example

```typescript
import { AsyncDriver } from '@rinari/types';

const driver: AsyncDriver = new MongoDriver(config);
const user = await driver.findOne('main', 'users', { where: { id: 1 } });
console.log(user); // Must await
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

> **bulkInsert**\<`T`\>(`dbName`, `tableName`, `records`): `Promise`\<`T`[]\>

Defined in: [driver.ts:528](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L528)

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

`Promise`\<`T`[]\>

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

> **bulkUpdate**(`dbName`, `tableName`, `updates`): `Promise`\<`number`\>

Defined in: [driver.ts:539](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L539)

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

`Promise`\<`number`\>

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

> **connect**(`config`): `Promise`\<`void`\>

Defined in: [driver.ts:519](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L519)

Establish database connection.

#### Parameters

##### config

[`DriverConfig`](DriverConfig.md)

Driver configuration

#### Returns

`Promise`\<`void`\>

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

> **count**(`dbName`, `tableName`, `where?`): `Promise`\<`number`\>

Defined in: [driver.ts:526](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L526)

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

`Promise`\<`number`\>

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

> **createIndex**(`dbName`, `tableName`, `indexName`, `options`): `Promise`\<`void`\>

Defined in: [driver.ts:545](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L545)

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

`Promise`\<`void`\>

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

> **createTable**(`dbName`, `tableName`, `schema`): `Promise`\<`void`\>

Defined in: [driver.ts:521](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L521)

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

`Promise`\<`void`\>

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

> **delete**(`dbName`, `tableName`, `where`): `Promise`\<`number`\>

Defined in: [driver.ts:544](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L544)

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

`Promise`\<`number`\>

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

> **disconnect**(): `Promise`\<`void`\>

Defined in: [driver.ts:520](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L520)

Close database connection and cleanup resources.

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await driver.disconnect();
```

#### Overrides

[`Driver`](Driver.md).[`disconnect`](Driver.md#disconnect)

***

### dropIndex()

> **dropIndex**(`dbName`, `tableName`, `indexName`): `Promise`\<`void`\>

Defined in: [driver.ts:551](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L551)

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

`Promise`\<`void`\>

#### Example

```typescript
driver.dropIndex('main', 'users', 'idx_email');
```

#### Overrides

[`Driver`](Driver.md).[`dropIndex`](Driver.md#dropindex)

***

### dropTable()

> **dropTable**(`dbName`, `tableName`): `Promise`\<`void`\>

Defined in: [driver.ts:522](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L522)

Drop (delete) a table.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
driver.dropTable('main', 'old_users');
```

#### Overrides

[`Driver`](Driver.md).[`dropTable`](Driver.md#droptable)

***

### findAll()

> **findAll**\<`T`\>(`dbName`, `tableName`, `options`): `Promise`\<`T`[]\>

Defined in: [driver.ts:525](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L525)

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

`Promise`\<`T`[]\>

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

> **findOne**\<`T`\>(`dbName`, `tableName`, `options`): `Promise`\<`T` \| `null`\>

Defined in: [driver.ts:524](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L524)

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

`Promise`\<`T` \| `null`\>

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

> **insert**\<`T`\>(`dbName`, `tableName`, `data`): `Promise`\<`T`\>

Defined in: [driver.ts:527](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L527)

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

`Promise`\<`T`\>

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

> **tableExists**(`dbName`, `tableName`): `Promise`\<`boolean`\>

Defined in: [driver.ts:523](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L523)

Check if a table exists.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

`Promise`\<`boolean`\>

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

> **transaction**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [driver.ts:552](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L552)

Execute a transaction.

#### Type Parameters

##### T

`T`

Transaction return type

#### Parameters

##### fn

() => `Promise`\<`T`\>

Transaction callback

#### Returns

`Promise`\<`T`\>

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

> **update**(`dbName`, `tableName`, `data`, `where`): `Promise`\<`number`\>

Defined in: [driver.ts:533](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L533)

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

`Promise`\<`number`\>

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
