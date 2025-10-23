[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / DataType

# Type Alias: DataType

> **DataType** = `"TEXT"` \| `"STRING"` \| `"INTEGER"` \| `"NUMBER"` \| `"REAL"` \| `"BLOB"` \| `"BOOLEAN"` \| `"DATE"` \| `"DATETIME"` \| `"JSON"` \| `"OBJECT"` \| `"ARRAY"`

Defined in: [orm.ts:10](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L10)

Data type identifier for column definitions.

## Remarks

Supported types include text, numeric, date/time, and structured data types.
Drivers map these to their native equivalents (e.g., TEXT → VARCHAR, JSON → TEXT).
