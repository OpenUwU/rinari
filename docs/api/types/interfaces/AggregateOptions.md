[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / AggregateOptions

# Interface: AggregateOptions

Defined in:
[orm.ts:444](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L444)

Aggregation options for GROUP BY and HAVING clauses.

## Remarks

Used with aggregate functions like COUNT, SUM, AVG, etc.

## Example

```typescript
const options: AggregateOptions = {
  groupBy: ['category'],
  having: { count: { $gt: 5 } },
};
```

## Properties

### groupBy?

> `optional` **groupBy**: `string`[]

Defined in:
[orm.ts:448](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L448)

Columns to group results by.

---

### having?

> `optional` **having**: `Record`\<`string`, `any`\>

Defined in:
[orm.ts:453](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L453)

Filter conditions applied after grouping.
