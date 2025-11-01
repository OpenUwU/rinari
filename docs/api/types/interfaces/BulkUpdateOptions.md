[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / BulkUpdateOptions

# Interface: BulkUpdateOptions

Defined in:
[orm.ts:253](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L253)

Bulk update operation specification.

## Remarks

Used for performing multiple updates in a single transaction.

## Example

```typescript
const updates: BulkUpdateOptions[] = [
  { where: { id: 1 }, values: { status: 'active' } },
  { where: { id: 2 }, values: { status: 'inactive' } },
];
```

## Properties

### values

> **values**: `Record`\<`string`, `any`\>

Defined in:
[orm.ts:262](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L262)

New values to apply.

---

### where

> **where**: `Record`\<`string`, `any`\>

Defined in:
[orm.ts:257](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L257)

Conditions to match records for update.
