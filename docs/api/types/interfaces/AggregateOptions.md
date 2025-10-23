[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / AggregateOptions

# Interface: AggregateOptions

Defined in: [orm.ts:444](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L444)

Aggregation options for GROUP BY and HAVING clauses.

## Remarks

Used with aggregate functions like COUNT, SUM, AVG, etc.

## Example

```typescript
const options: AggregateOptions = {
  groupBy: ['category'],
  having: { count: { $gt: 5 } }
};
```

## Properties

### groupBy?

> `optional` **groupBy**: `string`[]

Defined in: [orm.ts:448](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L448)

Columns to group results by.

***

### having?

> `optional` **having**: `Record`\<`string`, `any`\>

Defined in: [orm.ts:453](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L453)

Filter conditions applied after grouping.
