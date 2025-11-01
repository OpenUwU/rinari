[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / TableSchema

# Interface: TableSchema

Defined in:
[orm.ts:158](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L158)

Table schema definition mapping column names to their definitions.

## Remarks

A table schema is a key-value object where keys are column names and values are
[ColumnDefinition](ColumnDefinition.md) objects.

## Example

```typescript
import { TableSchema, DataTypes } from '@rinari/types';

const userSchema: TableSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    default: true,
  },
  metadata: {
    type: DataTypes.JSON,
  },
};
```

## Indexable

\[`columnName`: `string`\]: [`ColumnDefinition`](ColumnDefinition.md)
