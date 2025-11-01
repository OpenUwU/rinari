[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / QueryOptions

# Interface: QueryOptions

Defined in:
[orm.ts:194](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L194)

Query options for finding and filtering records.

## Remarks

Controls filtering, sorting, pagination, and field selection for queries. All
properties are optional - omitting them returns all records.

## Examples

Basic filtering:

```typescript
const options: QueryOptions = {
  where: { age: 25, isActive: true },
};
```

Advanced query with operators:

```typescript
const options: QueryOptions = {
  where: {
    age: { $gte: 18, $lt: 65 },
    username: { $like: '%john%' },
  },
  orderBy: [['created_at', 'DESC']],
  limit: 10,
  offset: 0,
  select: ['id', 'username', 'email'],
};
```

## Properties

### limit?

> `optional` **limit**: `number`

Defined in:
[orm.ts:219](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L219)

Maximum number of records to return.

---

### offset?

> `optional` **offset**: `number`

Defined in:
[orm.ts:224](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L224)

Number of records to skip (for pagination).

---

### orderBy?

> `optional` **orderBy**: \[`string`, `"ASC"` \| `"DESC"`\][]

Defined in:
[orm.ts:214](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L214)

Sort order as array of [column, direction] tuples.

#### Example

```typescript
orderBy: [
  ['created_at', 'DESC'],
  ['username', 'ASC'],
];
```

---

### select?

> `optional` **select**: `string`[]

Defined in:
[orm.ts:234](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L234)

Specific columns to select (omit for all columns).

#### Example

```typescript
select: ['id', 'username', 'email'];
```

---

### where?

> `optional` **where**: `Record`\<`string`, `any`\>

Defined in:
[orm.ts:204](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L204)

Filter conditions. Supports both direct values and operator objects.

#### Example

```typescript
where: { id: 1 }
where: { age: { $gte: 18 }, status: 'active' }
```
