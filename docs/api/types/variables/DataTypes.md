[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / DataTypes

# Variable: DataTypes

> `const` **DataTypes**: `object`

Defined in:
[data-types.ts:23](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/data-types.ts#L23)

Standard data types supported across all Rinari drivers.

## Type Declaration

### ARRAY

> `readonly` **ARRAY**: `"ARRAY"`

### BLOB

> `readonly` **BLOB**: `"BLOB"`

### BOOLEAN

> `readonly` **BOOLEAN**: `"BOOLEAN"`

### DATE

> `readonly` **DATE**: `"DATE"`

### DATETIME

> `readonly` **DATETIME**: `"DATETIME"`

### INTEGER

> `readonly` **INTEGER**: `"INTEGER"`

### JSON

> `readonly` **JSON**: `"JSON"`

### NUMBER

> `readonly` **NUMBER**: `"NUMBER"`

### OBJECT

> `readonly` **OBJECT**: `"OBJECT"`

### REAL

> `readonly` **REAL**: `"REAL"`

### STRING

> `readonly` **STRING**: `"STRING"`

### TEXT

> `readonly` **TEXT**: `"TEXT"`

## Remarks

These data types provide a unified abstraction layer across different database
systems. Each driver is responsible for mapping these types to their native
equivalents.

## Example

```typescript
import { DataTypes } from '@rinari/types';

const userSchema = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, notNull: true },
  age: { type: DataTypes.INTEGER },
  balance: { type: DataTypes.REAL },
  metadata: { type: DataTypes.JSON },
};
```
