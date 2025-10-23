[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / WhereOperators

# Interface: WhereOperators

Defined in: [orm.ts:365](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L365)

Query operators for advanced WHERE conditions.

## Remarks

Use these operators for complex filtering beyond simple equality.

## Example

```typescript
const condition: WhereOperators = {
  $gte: 18,
  $lt: 65
};

where: { age: condition }
```

## Properties

### $between?

> `optional` **$between**: \[[`WhereValue`](../type-aliases/WhereValue.md), [`WhereValue`](../type-aliases/WhereValue.md)\]

Defined in: [orm.ts:418](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L418)

Value is between two values (inclusive).

#### Example

```ts
`{ age: { $between: [18, 65] } }`
```

***

### $gt?

> `optional` **$gt**: [`WhereValue`](../type-aliases/WhereValue.md)

Defined in: [orm.ts:370](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L370)

Greater than.

#### Example

```ts
`{ age: { $gt: 17 } }`
```

***

### $gte?

> `optional` **$gte**: [`WhereValue`](../type-aliases/WhereValue.md)

Defined in: [orm.ts:376](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L376)

Greater than or equal to.

#### Example

```ts
`{ age: { $gte: 18 } }`
```

***

### $in?

> `optional` **$in**: [`WhereValue`](../type-aliases/WhereValue.md)[]

Defined in: [orm.ts:400](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L400)

Value is in the array.

#### Example

```ts
`{ role: { $in: ['admin', 'moderator'] } }`
```

***

### $like?

> `optional` **$like**: `string`

Defined in: [orm.ts:412](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L412)

Pattern matching with wildcards.

#### Example

```ts
`{ username: { $like: '%john%' } }`
```

***

### $lt?

> `optional` **$lt**: [`WhereValue`](../type-aliases/WhereValue.md)

Defined in: [orm.ts:382](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L382)

Less than.

#### Example

```ts
`{ age: { $lt: 65 } }`
```

***

### $lte?

> `optional` **$lte**: [`WhereValue`](../type-aliases/WhereValue.md)

Defined in: [orm.ts:388](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L388)

Less than or equal to.

#### Example

```ts
`{ age: { $lte: 64 } }`
```

***

### $ne?

> `optional` **$ne**: [`WhereValue`](../type-aliases/WhereValue.md)

Defined in: [orm.ts:394](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L394)

Not equal to.

#### Example

```ts
`{ status: { $ne: 'banned' } }`
```

***

### $notIn?

> `optional` **$notIn**: [`WhereValue`](../type-aliases/WhereValue.md)[]

Defined in: [orm.ts:406](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L406)

Value is not in the array.

#### Example

```ts
`{ status: { $notIn: ['banned', 'suspended'] } }`
```
