[**@rinari/orm**](../README.md)

***

[@rinari/orm](../README.md) / Model

# Class: Model\<T\>

Defined in: [model.ts:54](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L54)

Model class representing a database table with CRUD operations.

## Remarks

Models provide an object-oriented interface for interacting with database tables.
Each model instance corresponds to a specific table in a specific database.

Models are created via [ORM.define](ORM.md#define) and should not be instantiated directly.

## Example

Create and use a model:
```typescript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

interface User {
  id: number;
  username: string;
  email: string;
  age: number;
}

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' })
});

const User = orm.define<User>('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true },
  age: { type: DataTypes.INTEGER }
});

const newUser = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25
});

const users = User.findAll({ where: { age: { $gte: 18 } } });
const count = User.count({ isActive: true });

User.update({ age: 26 }, { id: newUser.id });
User.delete({ id: newUser.id });
```

## Type Parameters

### T

`T` = `any`

The type of records in this table

## Constructors

### Constructor

> **new Model**\<`T`\>(`dbName`, `tableName`, `schema`, `driver`): `Model`\<`T`\>

Defined in: [model.ts:72](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L72)

**`Internal`**

Creates a new Model instance.

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

##### driver

`Driver`

Database driver instance

#### Returns

`Model`\<`T`\>

#### Remarks

Models should be created using [ORM.define](ORM.md#define), not directly instantiated.

## Properties

### dbName

> `protected` **dbName**: `string`

Defined in: [model.ts:56](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L56)

***

### driver

> `protected` **driver**: `Driver`

Defined in: [model.ts:58](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L58)

***

### schema

> `protected` **schema**: `TableSchema`

Defined in: [model.ts:57](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L57)

***

### tableName

> `protected` **tableName**: `string`

Defined in: [model.ts:55](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L55)

## Accessors

### database

#### Get Signature

> **get** **database**(): `string`

Defined in: [model.ts:582](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L582)

Get the database name.

##### Example

```typescript
console.log(User.database); // "default"
```

##### Returns

`string`

***

### table

#### Get Signature

> **get** **table**(): `string`

Defined in: [model.ts:570](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L570)

Get the table name.

##### Example

```typescript
console.log(User.table); // "users"
```

##### Returns

`string`

## Methods

### aggregate()

> **aggregate**(`operation`, `field`, `where?`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:444](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L444)

Perform an aggregation operation.

#### Parameters

##### operation

`string`

Aggregation type (SUM, AVG, MIN, MAX, COUNT)

##### field

`string`

Field to aggregate

##### where?

`Record`\<`string`, `any`\>

Optional filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Aggregation result

#### Throws

If driver doesn't support aggregation

#### Example

```typescript
const totalAge = User.aggregate('SUM', 'age');
const avgAge = User.aggregate('AVG', 'age', { status: 'active' });
const maxAge = User.aggregate('MAX', 'age');
```

***

### avg()

> **avg**(`field`, `where?`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:487](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L487)

Calculate average of a numeric field.

#### Parameters

##### field

`string`

Field name

##### where?

`Record`\<`string`, `any`\>

Optional filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Average of field values

#### Example

```typescript
const avgAge = User.avg('age');
const avgActiveAge = User.avg('age', { isActive: true });
```

***

### bulkCreate()

> **bulkCreate**(`records`): `T`[] \| `Promise`\<`T`[]\>

Defined in: [model.ts:251](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L251)

Insert multiple records in a single operation.

#### Parameters

##### records

`Partial`\<`T`\>[]

Array of records to insert

#### Returns

`T`[] \| `Promise`\<`T`[]\>

Array of created records with generated IDs

#### Remarks

This is more efficient than calling [create](#create) multiple times.
All inserts are performed within a transaction for atomicity.

#### Example

```typescript
const users = User.bulkCreate([
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' },
  { username: 'charlie', email: 'charlie@example.com' }
]);
console.log(`Created ${users.length} users`);
```

***

### bulkDelete()

> **bulkDelete**(`whereConditions`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:353](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L353)

Delete multiple sets of records in a single transaction.

#### Parameters

##### whereConditions

`Record`\<`string`, `any`\>[]

Array of filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Total number of deleted records

#### Example

```typescript
const deleted = User.bulkDelete([
  { status: 'banned' },
  { last_login: { $lt: '2023-01-01' } },
  { is_deleted: true }
]);
console.log(`${deleted} records deleted`);
```

***

### bulkUpdate()

> **bulkUpdate**(`updates`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:301](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L301)

Perform multiple different updates in a single transaction.

#### Parameters

##### updates

`object`[]

Array of update operations

#### Returns

`number` \| `Promise`\<`number`\>

Total number of updated records

#### Example

```typescript
const updated = User.bulkUpdate([
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } },
  { where: { id: 3 }, data: { status: 'banned' } }
]);
console.log(`${updated} records updated`);
```

***

### count()

> **count**(`where?`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:207](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L207)

Count records matching the where condition.

#### Parameters

##### where?

`Record`\<`string`, `any`\>

Filter conditions (optional)

#### Returns

`number` \| `Promise`\<`number`\>

Number of matching records

#### Examples

Count all records:
```typescript
const totalUsers = User.count();
```

Count with condition:
```typescript
const activeUsers = User.count({ isActive: true });
const adults = User.count({ age: { $gte: 18 } });
```

***

### create()

> **create**(`data`): `T` \| `Promise`\<`T`\>

Defined in: [model.ts:227](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L227)

Create and insert a new record.

#### Parameters

##### data

`Partial`\<`T`\>

Record data

#### Returns

`T` \| `Promise`\<`T`\>

Created record with generated ID

#### Example

```typescript
const user = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25
});
console.log(`Created user with ID: ${user.id}`);
```

***

### createIndex()

> **createIndex**(`indexName`, `options`): `void` \| `Promise`\<`void`\>

Defined in: [model.ts:409](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L409)

Create an index on specified columns.

#### Parameters

##### indexName

`string`

Name for the index

##### options

`IndexOptions`

Index options (columns, unique, etc.)

#### Returns

`void` \| `Promise`\<`void`\>

#### Examples

Simple index:
```typescript
User.createIndex('idx_email', {
  columns: ['email']
});
```

Unique composite index:
```typescript
User.createIndex('idx_username_email', {
  unique: true,
  columns: ['username', 'email']
});
```

Partial index:
```typescript
User.createIndex('idx_active_users', {
  columns: ['created_at'],
  where: "status = 'active'"
});
```

***

### delete()

> **delete**(`where`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:333](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L333)

Delete records matching the where condition.

#### Parameters

##### where

`Record`\<`string`, `any`\>

Filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Number of deleted records

#### Examples

Delete by ID:
```typescript
const deleted = User.delete({ id: 1 });
console.log(`${deleted} records deleted`);
```

Delete with condition:
```typescript
const deleted = User.delete({
  status: 'banned',
  last_login: { $lt: '2024-01-01' }
});
```

***

### dropIndex()

> **dropIndex**(`indexName`): `void` \| `Promise`\<`void`\>

Defined in: [model.ts:423](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L423)

Drop (delete) an index.

#### Parameters

##### indexName

`string`

Name of the index to drop

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```typescript
User.dropIndex('idx_email');
```

***

### findAll()

> **findAll**(`options`): `T`[] \| `Promise`\<`T`[]\>

Defined in: [model.ts:166](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L166)

Find all records matching the query options.

#### Parameters

##### options

`QueryOptions` = `{}`

Query options (where, orderBy, limit, etc.)

#### Returns

`T`[] \| `Promise`\<`T`[]\>

Array of matching records

#### Examples

Find all records:
```typescript
const allUsers = User.findAll();
```

With filtering and sorting:
```typescript
const activeUsers = User.findAll({
  where: { isActive: true },
  orderBy: [['created_at', 'DESC']],
  limit: 10,
  offset: 0
});
```

With complex conditions:
```typescript
const users = User.findAll({
  where: {
    age: { $gte: 18, $lt: 65 },
    role: { $in: ['admin', 'moderator'] }
  },
  select: ['id', 'username', 'role']
});
```

***

### findById()

> **findById**(`id`): `T` \| `Promise`\<`T` \| `null`\> \| `null`

Defined in: [model.ts:184](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L184)

Find a single record by its primary key (id).

#### Parameters

##### id

Primary key value

`string` | `number`

#### Returns

`T` \| `Promise`\<`T` \| `null`\> \| `null`

Matching record or null

#### Example

```typescript
const user = User.findById(1);
if (user) {
  console.log(user.username);
}
```

***

### findOne()

> **findOne**(`options`): `T` \| `Promise`\<`T` \| `null`\> \| `null`

Defined in: [model.ts:127](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L127)

Find a single record matching the query options.

#### Parameters

##### options

`QueryOptions` = `{}`

Query options (where, select, etc.)

#### Returns

`T` \| `Promise`\<`T` \| `null`\> \| `null`

Matching record or null

#### Examples

Simple query:
```typescript
const user = User.findOne({ where: { username: 'alice' } });
```

With field selection:
```typescript
const user = User.findOne({
  where: { id: 1 },
  select: ['id', 'username', 'email']
});
```

With operators:
```typescript
const adult = User.findOne({
  where: { age: { $gte: 18 } }
});
```

***

### max()

> **max**(`field`, `where?`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:521](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L521)

Find maximum value of a field.

#### Parameters

##### field

`string`

Field name

##### where?

`Record`\<`string`, `any`\>

Optional filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Maximum field value

#### Example

```typescript
const maxAge = User.max('age');
const maxPrice = Product.max('price', { category: 'electronics' });
```

***

### min()

> **min**(`field`, `where?`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:504](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L504)

Find minimum value of a field.

#### Parameters

##### field

`string`

Field name

##### where?

`Record`\<`string`, `any`\>

Optional filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Minimum field value

#### Example

```typescript
const minAge = User.min('age');
const minPrice = Product.min('price', { category: 'electronics' });
```

***

### sum()

> **sum**(`field`, `where?`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:470](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L470)

Calculate sum of a numeric field.

#### Parameters

##### field

`string`

Field name

##### where?

`Record`\<`string`, `any`\>

Optional filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Sum of field values

#### Example

```typescript
const totalRevenue = Order.sum('amount');
const todayRevenue = Order.sum('amount', {
  created_at: { $gte: '2024-10-20' }
});
```

***

### transaction()

> **transaction**\<`R`\>(`fn`): `R` \| `Promise`\<`R`\>

Defined in: [model.ts:558](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L558)

Execute a transaction.

#### Type Parameters

##### R

`R`

Transaction return type

#### Parameters

##### fn

() => `R` \| `Promise`\<`R`\>

Transaction callback

#### Returns

`R` \| `Promise`\<`R`\>

Transaction result

#### Remarks

All operations within the callback execute atomically.
If an error occurs, all changes are rolled back.

#### Examples

```typescript
const result = User.transaction(() => {
  const user = User.create({ username: 'alice' });
  Profile.create({ userId: user.id, bio: 'Hello' });
  return user;
});
```

Error handling:
```typescript
try {
  User.transaction(() => {
    User.create({ username: 'alice' });
    throw new Error('Rollback!');
  });
} catch (error) {
  console.log('Transaction rolled back');
}
```

***

### update()

> **update**(`data`, `where`): `number` \| `Promise`\<`number`\>

Defined in: [model.ts:281](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/model.ts#L281)

Update records matching the where condition.

#### Parameters

##### data

`Partial`\<`T`\>

New values to set

##### where

`Record`\<`string`, `any`\>

Filter conditions

#### Returns

`number` \| `Promise`\<`number`\>

Number of updated records

#### Examples

Update by ID:
```typescript
const updated = User.update(
  { age: 26, status: 'active' },
  { id: 1 }
);
console.log(`${updated} records updated`);
```

Update multiple records:
```typescript
const updated = User.update(
  { isVerified: true },
  { email: { $like: '%@example.com' } }
);
```
