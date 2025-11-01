[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / IndexOptions

# Interface: IndexOptions

Defined in:
[orm.ts:322](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L322)

Index creation options.

## Remarks

Indexes improve query performance on frequently searched columns.

## Examples

Standard index:

```typescript
const indexOptions: IndexOptions = {
  columns: ['email'],
};
```

Unique composite index:

```typescript
const indexOptions: IndexOptions = {
  unique: true,
  columns: ['user_id', 'post_id'],
};
```

Partial index:

```typescript
const indexOptions: IndexOptions = {
  columns: ['status'],
  where: "status = 'active'",
};
```

## Properties

### columns

> **columns**: `string`[]

Defined in:
[orm.ts:332](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L332)

Columns to include in the index.

---

### unique?

> `optional` **unique**: `boolean`

Defined in:
[orm.ts:327](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L327)

Whether the index enforces uniqueness.

#### Default Value

```ts
false;
```

---

### where?

> `optional` **where**: `string`

Defined in:
[orm.ts:337](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/orm.ts#L337)

Optional WHERE clause for partial indexes.
