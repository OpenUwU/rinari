[**@rinari/orm**](../README.md)

***

[@rinari/orm](../README.md) / ORMOptions

# Interface: ORMOptions

Defined in: [orm.ts:42](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L42)

Configuration options for creating an ORM instance.

## Remarks

The ORM can be configured with a driver, optional connection config,
and pre-defined models for immediate use.

## Examples

Basic configuration:
```typescript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' })
});
```

With pre-defined models:
```typescript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
  models: {
    users: {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.TEXT, notNull: true, unique: true }
    },
    posts: {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.TEXT, notNull: true }
    }
  }
});
```

## Properties

### config?

> `optional` **config**: `DriverConfig`

Defined in: [orm.ts:52](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L52)

Optional driver configuration.
If provided, `driver.connect(config)` will be called automatically.

***

### driver

> **driver**: `Driver`

Defined in: [orm.ts:46](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L46)

Database driver instance.

***

### models?

> `optional` **models**: `string` \| `Record`\<`string`, `TableSchema`\>

Defined in: [orm.ts:58](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/orm/src/orm.ts#L58)

Pre-defined table schemas.
All models will be created in the 'default' database.
