**@rinari/types**

---

# @rinari/types

## Remarks

This package provides all shared interfaces, types, and enums used across the
Rinari ecosystem. It ensures type consistency between drivers and the core ORM.

## Example

Import types for use in your application:

```typescript
import {
  TableSchema,
  ColumnDefinition,
  QueryOptions,
  Driver,
  DataTypes,
} from '@rinari/types';
```

## Interfaces

- [AggregateOptions](interfaces/AggregateOptions.md)
- [AsyncDriver](interfaces/AsyncDriver.md)
- [BulkUpdateOptions](interfaces/BulkUpdateOptions.md)
- [ColumnDefinition](interfaces/ColumnDefinition.md)
- [Driver](interfaces/Driver.md)
- [DriverConfig](interfaces/DriverConfig.md)
- [DriverMetadata](interfaces/DriverMetadata.md)
- [IndexOptions](interfaces/IndexOptions.md)
- [QueryOptions](interfaces/QueryOptions.md)
- [SyncDriver](interfaces/SyncDriver.md)
- [TableSchema](interfaces/TableSchema.md)
- [TransactionCallback](interfaces/TransactionCallback.md)
- [WhereOperators](interfaces/WhereOperators.md)

## Type Aliases

- [DataType](type-aliases/DataType.md)
- [DataTypeValue](type-aliases/DataTypeValue.md)
- [WhereCondition](type-aliases/WhereCondition.md)
- [WhereValue](type-aliases/WhereValue.md)

## Variables

- [DataTypes](variables/DataTypes.md)
