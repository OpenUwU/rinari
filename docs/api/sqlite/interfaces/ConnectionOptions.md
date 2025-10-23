[**@rinari/sqlite**](../README.md)

***

[@rinari/sqlite](../README.md) / ConnectionOptions

# Interface: ConnectionOptions

Defined in: [connection.ts:24](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L24)

Options for establishing a database connection.

## Remarks

Configure connection behavior including file location, access mode,
timeouts, and logging.

## Example

```typescript
const options: ConnectionOptions = {
  filepath: './data/mydb.sqlite',
  readonly: false,
  verbose: true,
  timeout: 10000
};
```

## Properties

### fileMustExist?

> `optional` **fileMustExist**: `boolean`

Defined in: [connection.ts:41](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L41)

Throw an error if the database file doesn't exist.

#### Default Value

```ts
false
```

***

### filepath

> **filepath**: `string`

Defined in: [connection.ts:29](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L29)

Path to the SQLite database file.
Parent directories will be created automatically if they don't exist.

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [connection.ts:35](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L35)

Open database in read-only mode.

#### Default Value

```ts
false
```

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [connection.ts:47](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L47)

Timeout in milliseconds for database operations.

#### Default Value

```ts
5000
```

***

### verbose?

> `optional` **verbose**: `boolean`

Defined in: [connection.ts:53](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L53)

Enable verbose logging (logs all SQL statements).

#### Default Value

```ts
false
```
