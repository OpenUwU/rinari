[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / DataTypeValue

# Type Alias: DataTypeValue

> **DataTypeValue** = _typeof_ [`DataTypes`](../variables/DataTypes.md)\[keyof
> _typeof_ [`DataTypes`](../variables/DataTypes.md)\]

Defined in:
[data-types.ts:55](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/data-types.ts#L55)

Union type of all valid data type values.

## Remarks

This type is derived from the [DataTypes](../variables/DataTypes.md) constant
object. Use this type for type-safe data type specifications.

## Example

```typescript
import { DataTypeValue, DataTypes } from '@rinari/types';

const myType: DataTypeValue = DataTypes.TEXT; // ✓ Valid
const invalidType: DataTypeValue = 'INVALID'; // ✗ Type error
```
