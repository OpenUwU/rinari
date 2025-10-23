[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / ColumnDefinition

# Interface: ColumnDefinition

Defined in: [orm.ts:59](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L59)

Column definition for table schema.

## Remarks

Defines the structure, constraints, and relationships for a single column.
Use this to specify column properties when creating models.

## Example

```typescript
import { ColumnDefinition, DataTypes } from '@rinari/types';

const idColumn: ColumnDefinition = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
};

const emailColumn: ColumnDefinition = {
  type: DataTypes.TEXT,
  notNull: true,
  unique: true
};

const foreignKeyColumn: ColumnDefinition = {
  type: DataTypes.INTEGER,
  references: {
    table: 'users',
    column: 'id',
    onDelete: 'CASCADE'
  }
};
```

## Properties

### autoIncrement?

> `optional` **autoIncrement**: `boolean`

Defined in: [orm.ts:75](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L75)

Whether this column auto-increments (requires INTEGER type and primaryKey).

#### Default Value

```ts
false
```

***

### default?

> `optional` **default**: `any`

Defined in: [orm.ts:93](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L93)

Default value for this column.
Type should match the column's data type.

***

### notNull?

> `optional` **notNull**: `boolean`

Defined in: [orm.ts:81](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L81)

Whether this column cannot contain NULL values.

#### Default Value

```ts
false
```

***

### primaryKey?

> `optional` **primaryKey**: `boolean`

Defined in: [orm.ts:69](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L69)

Whether this column is the primary key.

#### Default Value

```ts
false
```

***

### references?

> `optional` **references**: `object`

Defined in: [orm.ts:108](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L108)

Foreign key reference configuration.

#### column

> **column**: `string`

#### onDelete?

> `optional` **onDelete**: `"CASCADE"` \| `"SET NULL"` \| `"RESTRICT"` \| `"NO ACTION"`

#### onUpdate?

> `optional` **onUpdate**: `"CASCADE"` \| `"SET NULL"` \| `"RESTRICT"` \| `"NO ACTION"`

#### table

> **table**: `string`

#### Example

```typescript
references: {
  table: 'users',
  column: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
}
```

***

### type

> **type**: [`DataType`](../type-aliases/DataType.md)

Defined in: [orm.ts:63](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L63)

The data type of the column.

***

### unique?

> `optional` **unique**: `boolean`

Defined in: [orm.ts:87](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L87)

Whether values in this column must be unique.

#### Default Value

```ts
false
```
