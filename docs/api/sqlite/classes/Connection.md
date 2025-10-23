[**@rinari/sqlite**](../README.md)

***

[@rinari/sqlite](../README.md) / Connection

# Class: Connection

Defined in: [connection.ts:91](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L91)

Database connection wrapper for better-sqlite3.

## Remarks

Manages a single SQLite database connection with optimized settings
for performance and reliability. Automatically configures WAL mode,
foreign keys, and caching.

## Examples

Basic connection:
```typescript
import { Connection } from '@rinari/sqlite';

const conn = new Connection({
  filepath: './data/mydb.sqlite',
  verbose: true
});

const result = conn.prepare('SELECT * FROM users').all();

conn.close();
```

Transaction usage:
```typescript
const result = conn.transaction(() => {
  conn.prepare('INSERT INTO users (username) VALUES (?)').run('alice');
  conn.prepare('INSERT INTO profiles (user_id) VALUES (?)').run(1);
  return conn.prepare('SELECT * FROM users WHERE username = ?').get('alice');
});
```

## Constructors

### Constructor

> **new Connection**(`options`): `Connection`

Defined in: [connection.ts:118](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L118)

Creates a new database connection.

#### Parameters

##### options

[`ConnectionOptions`](../interfaces/ConnectionOptions.md)

Connection configuration

#### Returns

`Connection`

#### Remarks

The connection is automatically opened and optimized with:
- WAL (Write-Ahead Logging) mode
- NORMAL synchronous mode
- 64MB cache size
- Memory-based temp storage
- Foreign key constraints enabled

#### Example

```typescript
const conn = new Connection({
  filepath: './data/app.db',
  verbose: false,
  timeout: 5000
});
```

## Accessors

### database

#### Get Signature

> **get** **database**(): `Database`

Defined in: [connection.ts:153](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L153)

Get the underlying better-sqlite3 database instance.

##### Throws

If the connection is closed

##### Example

```typescript
const db = conn.database;
db.prepare('VACUUM').run();
```

##### Returns

`Database`

***

### inTransaction

#### Get Signature

> **get** **inTransaction**(): `boolean`

Defined in: [connection.ts:275](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L275)

Check if a transaction is currently active.

##### Example

```typescript
conn.transaction(() => {
  console.log(conn.inTransaction); // true
});
console.log(conn.inTransaction); // false
```

##### Returns

`boolean`

***

### memory

#### Get Signature

> **get** **memory**(): `object`

Defined in: [connection.ts:370](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L370)

Get memory usage statistics.

##### Example

```typescript
const mem = conn.memory;
console.log(`Database size: ${(mem.used / 1024 / 1024).toFixed(2)} MB`);
```

##### Returns

`object`

Object with used and highwater memory values in bytes

###### highwater

> **highwater**: `number`

###### used

> **used**: `number`

## Methods

### analyze()

> **analyze**(): `this`

Defined in: [connection.ts:354](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L354)

Analyze the database to update optimizer statistics.

#### Returns

`this`

this for method chaining

#### Remarks

ANALYZE gathers statistics about table content to help the query planner.
Run this after significant data changes.

#### Example

```typescript
conn.analyze();
```

***

### checkpoint()

> **checkpoint**(`mode?`): `this`

Defined in: [connection.ts:297](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L297)

Perform a WAL checkpoint.

#### Parameters

##### mode?

Checkpoint mode

`"PASSIVE"` | `"FULL"` | `"RESTART"` | `"TRUNCATE"`

#### Returns

`this`

this for method chaining

#### Remarks

WAL checkpoints transfer data from the WAL file to the main database file.
- PASSIVE: Checkpoint as much as possible without blocking
- FULL: Wait for all transactions and checkpoint everything
- RESTART: Full checkpoint and restart the WAL
- TRUNCATE: Restart and truncate the WAL file

#### Example

```typescript
conn.checkpoint('TRUNCATE');
```

***

### close()

> **close**(): `void`

Defined in: [connection.ts:257](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L257)

Close the database connection and release resources.

#### Returns

`void`

#### Remarks

Always call this method when you're done using the connection
to prevent resource leaks.

#### Example

```typescript
const conn = new Connection({ filepath: './data/app.db' });
try {
  // ... use connection
} finally {
  conn.close();
}
```

***

### exec()

> **exec**(`sql`): `this`

Defined in: [connection.ts:197](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L197)

Execute raw SQL without prepared statements.

#### Parameters

##### sql

`string`

SQL statement(s) to execute

#### Returns

`this`

this for method chaining

#### Remarks

Use this for DDL operations or multi-statement execution.
For single queries with parameters, use [prepare](#prepare).

#### Example

```typescript
conn.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE
  );
  CREATE INDEX idx_username ON users(username);
`);
```

***

### optimize()

> **optimize**(): `this`

Defined in: [connection.ts:316](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L316)

Optimize the database.

#### Returns

`this`

this for method chaining

#### Remarks

Updates internal statistics used by the query optimizer.
Run this periodically for better query performance.

#### Example

```typescript
conn.optimize();
```

***

### prepare()

> **prepare**(`sql`): `Statement`

Defined in: [connection.ts:172](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L172)

Prepare a SQL statement for execution.

#### Parameters

##### sql

`string`

SQL statement

#### Returns

`Statement`

Prepared statement

#### Example

```typescript
const stmt = conn.prepare('SELECT * FROM users WHERE age > ?');
const users = stmt.all(18);
```

***

### transaction()

> **transaction**\<`T`\>(`fn`): `T`

Defined in: [connection.ts:235](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L235)

Execute a transaction.

#### Type Parameters

##### T

`T`

Transaction return type

#### Parameters

##### fn

() => `T`

Transaction callback

#### Returns

`T`

Transaction result

#### Remarks

All operations in the callback are executed atomically.
If an error occurs, all changes are rolled back automatically.

#### Examples

```typescript
const user = conn.transaction(() => {
  const info = conn.prepare('INSERT INTO users (username) VALUES (?)').run('alice');
  conn.prepare('INSERT INTO profiles (user_id, bio) VALUES (?, ?)').run(info.lastInsertRowid, 'Hello');
  return conn.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
});
```

Transaction with error handling:
```typescript
try {
  conn.transaction(() => {
    conn.prepare('INSERT INTO users (username) VALUES (?)').run('alice');
    throw new Error('Rollback!');
  });
} catch (error) {
  console.log('Transaction rolled back');
}
```

***

### vacuum()

> **vacuum**(): `this`

Defined in: [connection.ts:335](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/sqlite/src/connection.ts#L335)

Compact the database file by rebuilding it.

#### Returns

`this`

this for method chaining

#### Remarks

VACUUM reclaims unused space and defragments the database.
This can be slow on large databases.

#### Example

```typescript
conn.vacuum();
```
