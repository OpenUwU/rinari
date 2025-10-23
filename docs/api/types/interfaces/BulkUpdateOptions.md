[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / BulkUpdateOptions

# Interface: BulkUpdateOptions

Defined in: [orm.ts:253](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L253)

Bulk update operation specification.

## Remarks

Used for performing multiple updates in a single transaction.

## Example

```typescript
const updates: BulkUpdateOptions[] = [
  { where: { id: 1 }, values: { status: 'active' } },
  { where: { id: 2 }, values: { status: 'inactive' } }
];
```

## Properties

### values

> **values**: `Record`\<`string`, `any`\>

Defined in: [orm.ts:262](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L262)

New values to apply.

***

### where

> **where**: `Record`\<`string`, `any`\>

Defined in: [orm.ts:257](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L257)

Conditions to match records for update.
