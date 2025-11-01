[**@rinari/bun-sqlite**](../README.md)

***

[@rinari/bun-sqlite](../README.md) / ConnectionOptions

# Interface: ConnectionOptions

Defined in: [connection.ts:23](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L23)

Options for establishing a database connection.

## Remarks

Configure connection behavior including file location, access mode,
and logging. Optimized for Bun's native SQLite implementation.

## Example

```typescript
const options: ConnectionOptions = {
  filepath: './data/mydb.sqlite',
  readonly: false,
  verbose: true
};
```

## Properties

### create?

> `optional` **create**: `boolean`

Defined in: [connection.ts:40](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L40)

Throw an error if the database file doesn't exist.

#### Default Value

```ts
false
```

***

### filepath

> **filepath**: `string`

Defined in: [connection.ts:28](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L28)

Path to the SQLite database file.
Parent directories will be created automatically if they don't exist.

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [connection.ts:34](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L34)

Open database in read-only mode.

#### Default Value

```ts
false
```

***

### verbose?

> `optional` **verbose**: `boolean`

Defined in: [connection.ts:46](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L46)

Enable verbose logging (logs all SQL statements).

#### Default Value

```ts
false
```
