[**@rinari/sqlite**](../README.md)

***

[@rinari/sqlite](../README.md) / QueryBuilder

# Class: QueryBuilder

Defined in: [query-builder.ts:28](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L28)

SQL query builder for SQLite with support for advanced operators.

## Remarks

Builds and executes SQL queries with automatic parameter binding,
value serialization, and comprehensive where clause support.

## Example

Basic usage:
```typescript
import { Connection, QueryBuilder } from '@rinari/sqlite';

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

Defined in: [query-builder.ts:40](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L40)

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

Defined in: [query-builder.ts:435](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L435)

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

Defined in: [query-builder.ts:311](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L311)

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

Defined in: [query-builder.ts:380](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L380)

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

Defined in: [query-builder.ts:252](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L252)

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

Defined in: [query-builder.ts:409](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L409)

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

Defined in: [query-builder.ts:228](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L228)

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

Defined in: [query-builder.ts:203](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L203)

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

Defined in: [query-builder.ts:277](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L277)

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

Defined in: [query-builder.ts:350](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/query-builder.ts#L350)

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
