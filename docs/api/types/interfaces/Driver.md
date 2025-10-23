[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / Driver

# Interface: Driver

Defined in: [driver.ts:122](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L122)

Base driver interface supporting both synchronous and asynchronous operations.

## Remarks

All drivers must implement this interface. Methods may return values directly
(synchronous) or wrapped in Promises (asynchronous) depending on the driver type.

Use [SyncDriver](SyncDriver.md) or [AsyncDriver](AsyncDriver.md) for type-specific implementations.

## Example

Creating a custom driver:
```typescript
import { Driver, DriverConfig, DriverMetadata } from '@rinari/types';

class MyDriver implements Driver {
  readonly metadata: DriverMetadata = {
    name: 'my-driver',
    version: '1.0.0'
  };

  connect(config: DriverConfig): void {
    // Connection logic
  }

  // ... implement other methods
}
```

## Extended by

- [`SyncDriver`](SyncDriver.md)
- [`AsyncDriver`](AsyncDriver.md)

## Properties

### metadata

> `readonly` **metadata**: [`DriverMetadata`](DriverMetadata.md)

Defined in: [driver.ts:126](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L126)

Driver metadata (name, version).

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

***

### bulkInsert()

> **bulkInsert**\<`T`\>(`dbName`, `tableName`, `records`): `T`[] \| `Promise`\<`T`[]\>

Defined in: [driver.ts:297](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L297)

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

`T`[] \| `Promise`\<`T`[]\>

Array of inserted records with generated IDs

#### Example

```typescript
const users = driver.bulkInsert<User>('main', 'users', [
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' }
]);
```

***

### bulkUpdate()

> **bulkUpdate**(`dbName`, `tableName`, `updates`): `number` \| `Promise`\<`number`\>

Defined in: [driver.ts:344](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L344)

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

`number` \| `Promise`\<`number`\>

Total number of updated records

#### Example

```typescript
const updated = driver.bulkUpdate('main', 'users', [
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } }
]);
```

***

### connect()

> **connect**(`config`): `void` \| `Promise`\<`void`\>

Defined in: [driver.ts:141](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L141)

Establish database connection.

#### Parameters

##### config

[`DriverConfig`](DriverConfig.md)

Driver configuration

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```typescript
driver.connect({
  storageDir: './data',
  verbose: true
});
```

***

### count()

> **count**(`dbName`, `tableName`, `where?`): `number` \| `Promise`\<`number`\>

Defined in: [driver.ts:257](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L257)

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

`number` \| `Promise`\<`number`\>

Number of matching records

#### Example

```typescript
const count = driver.count('main', 'users', {
  status: 'active'
});
console.log(`${count} active users`);
```

***

### createIndex()

> **createIndex**(`dbName`, `tableName`, `indexName`, `options`): `void` \| `Promise`\<`void`\>

Defined in: [driver.ts:384](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L384)

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

`void` \| `Promise`\<`void`\>

#### Example

```typescript
driver.createIndex('main', 'users', 'idx_email', {
  unique: true,
  columns: ['email']
});
```

***

### createTable()

> **createTable**(`dbName`, `tableName`, `schema`): `void` \| `Promise`\<`void`\>

Defined in: [driver.ts:168](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L168)

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

`void` \| `Promise`\<`void`\>

#### Example

```typescript
driver.createTable('main', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true }
});
```

***

### delete()

> **delete**(`dbName`, `tableName`, `where`): `number` \| `Promise`\<`number`\>

Defined in: [driver.ts:366](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L366)

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

`number` \| `Promise`\<`number`\>

Number of deleted records

#### Example

```typescript
const deleted = driver.delete('main', 'users', {
  status: 'banned'
});
console.log(`${deleted} users removed`);
```

***

### disconnect()

> **disconnect**(): `void` \| `Promise`\<`void`\>

Defined in: [driver.ts:151](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L151)

Close database connection and cleanup resources.

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```typescript
await driver.disconnect();
```

***

### dropIndex()

> **dropIndex**(`dbName`, `tableName`, `indexName`): `void` \| `Promise`\<`void`\>

Defined in: [driver.ts:403](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L403)

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

`void` \| `Promise`\<`void`\>

#### Example

```typescript
driver.dropIndex('main', 'users', 'idx_email');
```

***

### dropTable()

> **dropTable**(`dbName`, `tableName`): `void` \| `Promise`\<`void`\>

Defined in: [driver.ts:181](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L181)

Drop (delete) a table.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```typescript
driver.dropTable('main', 'old_users');
```

***

### findAll()

> **findAll**\<`T`\>(`dbName`, `tableName`, `options`): `T`[] \| `Promise`\<`T`[]\>

Defined in: [driver.ts:239](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L239)

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

`T`[] \| `Promise`\<`T`[]\>

Array of matching records

#### Example

```typescript
const adults = driver.findAll<User>('main', 'users', {
  where: { age: { $gte: 18 } },
  orderBy: [['age', 'ASC']],
  limit: 10
});
```

***

### findOne()

> **findOne**\<`T`\>(`dbName`, `tableName`, `options`): `T` \| `Promise`\<`T` \| `null`\> \| `null`

Defined in: [driver.ts:215](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L215)

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

`T` \| `Promise`\<`T` \| `null`\> \| `null`

Matching record or null

#### Example

```typescript
const user = driver.findOne<User>('main', 'users', {
  where: { username: 'alice' }
});
```

***

### insert()

> **insert**\<`T`\>(`dbName`, `tableName`, `data`): `T` \| `Promise`\<`T`\>

Defined in: [driver.ts:278](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L278)

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

`T` \| `Promise`\<`T`\>

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

***

### tableExists()

> **tableExists**(`dbName`, `tableName`): `boolean` \| `Promise`\<`boolean`\>

Defined in: [driver.ts:197](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L197)

Check if a table exists.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

`boolean` \| `Promise`\<`boolean`\>

True if table exists, false otherwise

#### Example

```typescript
if (driver.tableExists('main', 'users')) {
  console.log('Users table exists');
}
```

***

### transaction()

> **transaction**\<`T`\>(`fn`): `T` \| `Promise`\<`T`\>

Defined in: [driver.ts:425](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L425)

Execute a transaction.

#### Type Parameters

##### T

`T`

Transaction return type

#### Parameters

##### fn

() => `T` \| `Promise`\<`T`\>

Transaction callback

#### Returns

`T` \| `Promise`\<`T`\>

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

***

### update()

> **update**(`dbName`, `tableName`, `data`, `where`): `number` \| `Promise`\<`number`\>

Defined in: [driver.ts:321](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L321)

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

`number` \| `Promise`\<`number`\>

Number of updated records

#### Example

```typescript
const updated = driver.update('main', 'users',
  { status: 'inactive' },
  { last_login: { $lt: '2024-01-01' } }
);
console.log(`${updated} users deactivated`);
```
