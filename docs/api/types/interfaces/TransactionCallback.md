[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / TransactionCallback

# Interface: TransactionCallback()\<T\>

Defined in: [orm.ts:284](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L284)

Transaction callback function type.

## Remarks

Transactions execute all operations atomically - either all succeed or all fail.

## Example

```typescript
const callback: TransactionCallback<User> = () => {
  const user = userModel.create({ username: 'alice' });
  profileModel.create({ userId: user.id, bio: 'Hello' });
  return user;
};
```

## Type Parameters

### T

`T`

The return type of the transaction

> **TransactionCallback**(): `T` \| `Promise`\<`T`\>

Defined in: [orm.ts:285](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/orm.ts#L285)

Transaction callback function type.

## Returns

`T` \| `Promise`\<`T`\>

## Remarks

Transactions execute all operations atomically - either all succeed or all fail.

## Example

```typescript
const callback: TransactionCallback<User> = () => {
  const user = userModel.create({ username: 'alice' });
  profileModel.create({ userId: user.id, bio: 'Hello' });
  return user;
};
```
