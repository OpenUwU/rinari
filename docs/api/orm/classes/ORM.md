[**@rinari/orm**](../README.md)

***

[@rinari/orm](../README.md) / ORM

# Class: ORM

Defined in: [orm.ts:126](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L126)

Core ORM class for managing database models and operations.

## Remarks

The ORM provides a high-level API for defining models, managing multiple databases,
and executing database operations through a pluggable driver system.

## Examples

Complete usage example:
```typescript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' })
});

const User = orm.define('default', 'users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true
  },
  email: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true
  },
  age: {
    type: DataTypes.INTEGER
  }
});

const user = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25
});

const users = User.findAll({ where: { age: { $gte: 18 } } });

await orm.disconnect();
```

Multi-database usage:
```typescript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' })
});

const User = orm.define('users_db', 'users', schema);
const Product = orm.define('products_db', 'products', schema);

console.log(orm.getDatabases()); // ['users_db', 'products_db']
```

## Constructors

### Constructor

> **new ORM**(`options`): `ORM`

Defined in: [orm.ts:149](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L149)

Creates a new ORM instance.

#### Parameters

##### options

[`ORMOptions`](../interfaces/ORMOptions.md)

ORM configuration options

#### Returns

`ORM`

#### Example

```typescript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
  models: {
    users: {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.TEXT, notNull: true }
    }
  }
});
```

## Accessors

### driverInfo

#### Get Signature

> **get** **driverInfo**(): `DriverMetadata`

Defined in: [orm.ts:365](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L365)

Get driver metadata (name, version).

##### Example

```typescript
const info = orm.driverInfo;
console.log(`Using ${info.name} driver v${info.version}`);
```

##### Returns

`DriverMetadata`

Driver metadata object

## Methods

### define()

> **define**(`dbName`, `tableName`, `schema`): [`Model`](Model.md)

Defined in: [orm.ts:201](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L201)

Define a new model (table) in the specified database.

#### Parameters

##### dbName

`string`

Database name (use 'default' for single-database setups)

##### tableName

`string`

Table name

##### schema

`TableSchema`

Table schema definition

#### Returns

[`Model`](Model.md)

Model instance for the defined table

#### Remarks

If a model with the same name already exists, returns the existing model.
The table is automatically created if it doesn't exist.

#### Example

```typescript
import { DataTypes } from '@rinari/types';

const User = orm.define('default', 'users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true
  },
  email: {
    type: DataTypes.TEXT,
    notNull: true
  },
  created_at: {
    type: DataTypes.DATETIME,
    default: new Date().toISOString()
  }
});
```

***

### disconnect()

> **disconnect**(): `void` \| `Promise`\<`void`\>

Defined in: [orm.ts:350](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L350)

Disconnect from the database and cleanup resources.

#### Returns

`void` \| `Promise`\<`void`\>

#### Remarks

Always call this method when you're done using the ORM to prevent
resource leaks and ensure proper cleanup.

#### Example

```typescript
const orm = new ORM({ driver });

try {
  // ... use ORM
} finally {
  await orm.disconnect();
}
```

***

### getAllModels()

> **getAllModels**(`dbName`): `Map`\<`string`, [`Model`](Model.md)\<`any`\>\> \| `undefined`

Defined in: [orm.ts:313](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L313)

Get all models for a specific database.

#### Parameters

##### dbName

`string`

Database name

#### Returns

`Map`\<`string`, [`Model`](Model.md)\<`any`\>\> \| `undefined`

Map of table names to models, or undefined if database doesn't exist

#### Example

```typescript
const models = orm.getAllModels('default');
if (models) {
  for (const [tableName, model] of models) {
    console.log(`${tableName}: ${model.count()} records`);
  }
}
```

***

### getDatabases()

> **getDatabases**(): `string`[]

Defined in: [orm.ts:328](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L328)

Get names of all databases managed by this ORM instance.

#### Returns

`string`[]

Array of database names

#### Example

```typescript
const databases = orm.getDatabases();
console.log(`Managing ${databases.length} databases:`, databases);
```

***

### getSchemas()

> **getSchemas**(`dbName`): `Map`\<`string`, `TableSchema`\> \| `undefined`

Defined in: [orm.ts:293](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L293)

Get all schemas for a specific database.

#### Parameters

##### dbName

`string`

Database name

#### Returns

`Map`\<`string`, `TableSchema`\> \| `undefined`

Map of table names to schemas, or undefined if database doesn't exist

#### Example

```typescript
const schemas = orm.getSchemas('default');
if (schemas) {
  for (const [tableName, schema] of schemas) {
    console.log(`Table: ${tableName}`, schema);
  }
}
```

***

### hasModel()

> **hasModel**(`dbName`, `tableName`): `boolean`

Defined in: [orm.ts:273](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L273)

Check if a model exists.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

`boolean`

True if model exists, false otherwise

#### Example

```typescript
if (!orm.hasModel('default', 'users')) {
  orm.define('default', 'users', userSchema);
}
```

***

### model()

> **model**(`dbName`, `tableName`): [`Model`](Model.md)\<`any`\> \| `null`

Defined in: [orm.ts:236](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L236)

Retrieve an existing model by database and table name.

#### Parameters

##### dbName

`string`

Database name

##### tableName

`string`

Table name

#### Returns

[`Model`](Model.md)\<`any`\> \| `null`

Model instance or null if not found

#### Example

```typescript
const User = orm.model('default', 'users');
if (User) {
  const users = User.findAll();
}
```

***

### table()

> **table**(`tableName`, `dbName`): [`Model`](Model.md)\<`any`\> \| `null`

Defined in: [orm.ts:255](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L255)

Retrieve a model by table name (defaults to 'default' database).

#### Parameters

##### tableName

`string`

Table name

##### dbName

`string` = `'default'`

Database name (defaults to 'default')

#### Returns

[`Model`](Model.md)\<`any`\> \| `null`

Model instance or null if not found

#### Example

```typescript
const User = orm.table('users');
const user = User?.findOne({ where: { id: 1 } });
```
