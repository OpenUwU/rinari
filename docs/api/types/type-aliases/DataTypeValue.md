[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / DataTypeValue

# Type Alias: DataTypeValue

> **DataTypeValue** = *typeof* [`DataTypes`](../variables/DataTypes.md)\[keyof *typeof* [`DataTypes`](../variables/DataTypes.md)\]

Defined in: [data-types.ts:55](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/data-types.ts#L55)

Union type of all valid data type values.

## Remarks

This type is derived from the [DataTypes](../variables/DataTypes.md) constant object.
Use this type for type-safe data type specifications.

## Example

```typescript
import { DataTypeValue, DataTypes } from '@rinari/types';

const myType: DataTypeValue = DataTypes.TEXT; // ✓ Valid
const invalidType: DataTypeValue = 'INVALID'; // ✗ Type error
```
