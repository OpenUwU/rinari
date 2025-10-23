[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / DriverConfig

# Interface: DriverConfig

Defined in: [driver.ts:24](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L24)

Driver configuration options.

## Remarks

Configuration varies by driver type. Check your driver's documentation
for supported options and requirements.

## Example

SQLite driver configuration:
```typescript
import { DriverConfig } from '@rinari/types';

const config: DriverConfig = {
  storageDir: './data',
  verbose: false,
  readonly: false
};
```

## Properties

### connectionString?

> `optional` **connectionString**: `string`

Defined in: [driver.ts:39](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L39)

Connection string for database access.

***

### databases?

> `optional` **databases**: `Record`\<`string`, `string`\>

Defined in: [driver.ts:29](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L29)

Named database connections (driver-specific).
Maps database names to connection strings or file paths.

***

### options?

> `optional` **options**: `Record`\<`string`, `any`\>

Defined in: [driver.ts:44](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L44)

Driver-specific options.

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [driver.ts:56](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L56)

Open database in read-only mode.

#### Default Value

```ts
false
```

***

### storageDir

> **storageDir**: `string`

Defined in: [driver.ts:62](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L62)

Directory for storing database files.
Required for file-based drivers like SQLite.

***

### url?

> `optional` **url**: `string`

Defined in: [driver.ts:34](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L34)

Primary connection URL.

***

### verbose?

> `optional` **verbose**: `boolean`

Defined in: [driver.ts:50](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L50)

Enable verbose logging of database operations.

#### Default Value

```ts
false
```
