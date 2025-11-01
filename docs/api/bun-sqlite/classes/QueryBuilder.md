[**@rinari/bun-sqlite**](../README.md)

***

[@rinari/bun-sqlite](../README.md) / QueryBuilder

# Class: QueryBuilder

Defined in: [query-builder.ts:29](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L29)

SQL query builder for Bun SQLite with support for advanced operators.

## Remarks

Builds and executes SQL queries using Bun's native SQLite with automatic
parameter binding, value serialization, and comprehensive where clause support.
Optimized for Bun's high-performance query engine.

## Example

Basic usage:
```typescript
import { Connection, QueryBuilder } from '@rinari/bun-sqlite';

const conn = new Connection({ filepath: './data/app.db' });
const qb = new QueryBuilder(conn);

const users = qb.findAll('users', {
  where: { age: { $gte: 18 } },
  orderBy: [['username', 'ASC']],
  limit: 10
});
```

## Constructors

### Constructor

> **new QueryBuilder**(`connection`): `QueryBuilder`

Defined in: [query-builder.ts:41](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L41)

Creates a new query builder.

#### Parameters

##### connection

[`Connection`](Connection.md)

Database connection instance

#### Returns

`QueryBuilder`

#### Example

```typescript
const conn = new Connection({ filepath: './data/app.db' });
const qb = new QueryBuilder(conn);
```

## Methods

### aggregate()

> **aggregate**(`tableName`, `operation`, `field`, `where?`): `number`

Defined in: [query-builder.ts:436](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L436)

Perform an aggregation operation.

#### Parameters

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
const totalAge = qb.aggregate('users', 'SUM', 'age');
const avgAge = qb.aggregate('users', 'AVG', 'age', { status: 'active' });
const maxPrice = qb.aggregate('products', 'MAX', 'price', { category: 'electronics' });
```

***

### bulkInsert()

> **bulkInsert**(`tableName`, `records`): `any`[]

Defined in: [query-builder.ts:312](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L312)

Insert multiple records in a single transaction.

#### Parameters

##### tableName

`string`

Table name

##### records

`Record`\<`string`, `any`\>[]

Array of records to insert

#### Returns

`any`[]

Array of inserted records with generated IDs

#### Example

```typescript
const users = qb.bulkInsert('users', [
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' },
  { username: 'charlie', email: 'charlie@example.com' }
]);
```

***

### bulkUpdate()

> **bulkUpdate**(`tableName`, `updates`): `number`

Defined in: [query-builder.ts:381](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L381)

Perform multiple updates in a single transaction.

#### Parameters

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
const updated = qb.bulkUpdate('users', [
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } },
  { where: { id: 3 }, data: { status: 'banned' } }
]);
```

***

### count()

> **count**(`tableName`, `options`): `number`

Defined in: [query-builder.ts:253](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L253)

Count records matching the where condition.

#### Parameters

##### tableName

`string`

Table name

##### options

Query options (only `where` is used)

###### where?

`Record`\<`string`, `any`\>

#### Returns

`number`

Number of matching records

#### Example

```typescript
const count = qb.count('users', {
  where: { status: 'active' }
});
```

***

### delete()

> **delete**(`tableName`, `where`): `number`

Defined in: [query-builder.ts:410](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L410)

Delete records matching the where condition.

#### Parameters

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
const deleted = qb.delete('users', {
  status: 'banned',
  created_at: { $lt: '2023-01-01' }
});
console.log(`${deleted} users deleted`);
```

***

### findAll()

> **findAll**(`tableName`, `options`): `any`[]

Defined in: [query-builder.ts:229](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L229)

Find all records matching the options.

#### Parameters

##### tableName

`string`

Table name

##### options

`QueryOptions` = `{}`

Query options

#### Returns

`any`[]

Array of matching records

#### Example

```typescript
const users = qb.findAll('users', {
  where: { age: { $gte: 18 }, status: 'active' },
  orderBy: [['created_at', 'DESC']],
  limit: 10,
  offset: 0
});
```

***

### findOne()

> **findOne**(`tableName`, `options`): `any`

Defined in: [query-builder.ts:204](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L204)

Find a single record matching the options.

#### Parameters

##### tableName

`string`

Table name

##### options

`QueryOptions` = `{}`

Query options

#### Returns

`any`

Matching record or null

#### Example

```typescript
const user = qb.findOne('users', {
  where: { username: 'alice' },
  select: ['id', 'username', 'email']
});
```

***

### insert()

> **insert**(`tableName`, `data`): `any`

Defined in: [query-builder.ts:278](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L278)

Insert a new record.

#### Parameters

##### tableName

`string`

Table name

##### data

`Record`\<`string`, `any`\>

Record data

#### Returns

`any`

Inserted record with generated ID

#### Example

```typescript
const user = qb.insert('users', {
  username: 'alice',
  email: 'alice@example.com',
  age: 25
});
console.log(user.id); // Auto-generated ID
```

***

### update()

> **update**(`tableName`, `data`, `where`): `number`

Defined in: [query-builder.ts:351](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/query-builder.ts#L351)

Update records matching the where condition.

#### Parameters

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
const updated = qb.update('users',
  { status: 'inactive' },
  { last_login: { $lt: '2024-01-01' } }
);
console.log(`${updated} users deactivated`);
```
