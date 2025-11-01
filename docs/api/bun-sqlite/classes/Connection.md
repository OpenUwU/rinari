[**@rinari/bun-sqlite**](../README.md)

***

[@rinari/bun-sqlite](../README.md) / Connection

# Class: Connection

Defined in: [connection.ts:84](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L84)

Database connection wrapper for Bun's native SQLite.

## Remarks

Manages a single SQLite database connection using Bun's high-performance
native implementation. Automatically configures WAL mode, foreign keys,
and optimal caching settings.

## Examples

Basic connection:
```typescript
import { Connection } from '@rinari/bun-sqlite';

const conn = new Connection({
  filepath: './data/mydb.sqlite',
  verbose: true
});

const result = conn.query('SELECT * FROM users').all();

conn.close();
```

Transaction usage:
```typescript
const result = conn.transaction(() => {
  conn.query('INSERT INTO users (username) VALUES ($username)').run({ $username: 'alice' });
  conn.query('INSERT INTO profiles (user_id) VALUES ($uid)').run({ $uid: 1 });
  return conn.query('SELECT * FROM users WHERE username = $username').get({ $username: 'alice' });
});
```

## Constructors

### Constructor

> **new Connection**(`options`): `Connection`

Defined in: [connection.ts:110](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L110)

Creates a new database connection using Bun's native SQLite.

#### Parameters

##### options

[`ConnectionOptions`](../interfaces/ConnectionOptions.md)

Connection configuration

#### Returns

`Connection`

#### Remarks

The connection is automatically opened and optimized with:
- WAL (Write-Ahead Logging) mode for better concurrency
- NORMAL synchronous mode for balance of safety and speed
- Foreign key constraints enabled
- Memory-based temp storage for performance

#### Example

```typescript
const conn = new Connection({
  filepath: './data/app.db',
  verbose: false
});
```

## Accessors

### database

#### Get Signature

> **get** **database**(): `Database`

Defined in: [connection.ts:143](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L143)

Get the underlying Bun SQLite database instance.

##### Throws

If the connection is closed

##### Example

```typescript
const db = conn.database;
db.run('VACUUM');
```

##### Returns

`Database`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [connection.ts:389](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L389)

Get the filename of the database.

##### Example

```typescript
console.log(conn.filename); // './data/app.db'
```

##### Returns

`string`

Database filename

***

### inTransaction

#### Get Signature

> **get** **inTransaction**(): `boolean`

Defined in: [connection.ts:295](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L295)

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

## Methods

### analyze()

> **analyze**(): `this`

Defined in: [connection.ts:374](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L374)

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

Defined in: [connection.ts:317](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L317)

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

Defined in: [connection.ts:277](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L277)

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

Defined in: [connection.ts:210](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L210)

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
For single queries with parameters, use [query](#query).

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

Defined in: [connection.ts:336](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L336)

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

> **prepare**(`sql`): `Statement`\<`unknown`\>

Defined in: [connection.ts:185](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L185)

Prepare a SQL statement for execution (alias for query).

#### Parameters

##### sql

`string`

SQL statement

#### Returns

`Statement`\<`unknown`\>

Prepared statement

#### Example

```typescript
const stmt = conn.prepare('SELECT * FROM users WHERE age > $age');
const users = stmt.all({ $age: 18 });
```

***

### query()

> **query**(`sql`): `Statement`\<`unknown`\>

Defined in: [connection.ts:166](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L166)

Create a prepared SQL query.

#### Parameters

##### sql

`string`

SQL statement

#### Returns

`Statement`\<`unknown`\>

Prepared query

#### Remarks

In Bun SQLite, this returns a Query object with `.all()`, `.get()`, and `.run()` methods.
Queries are automatically cached by Bun for performance.

#### Example

```typescript
const query = conn.query('SELECT * FROM users WHERE age > $age');
const users = query.all({ $age: 18 });
```

***

### transaction()

> **transaction**\<`T`\>(`fn`): `T`

Defined in: [connection.ts:255](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L255)

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
Bun's transaction implementation is highly optimized.

#### Examples

```typescript
const user = conn.transaction(() => {
  const info = conn.query('INSERT INTO users (username) VALUES ($name)').run({ $name: 'alice' });
  conn.query('INSERT INTO profiles (user_id, bio) VALUES ($id, $bio)').run({
    $id: info.lastInsertRowid,
    $bio: 'Hello'
  });
  return conn.query('SELECT * FROM users WHERE id = $id').get({ $id: info.lastInsertRowid });
});
```

Transaction with error handling:
```typescript
try {
  conn.transaction(() => {
    conn.query('INSERT INTO users (username) VALUES ($name)').run({ $name: 'alice' });
    throw new Error('Rollback!');
  });
} catch (error) {
  console.log('Transaction rolled back');
}
```

***

### vacuum()

> **vacuum**(): `this`

Defined in: [connection.ts:355](https://github.com/OpenUwU/rinari/blob/7e5c2533dc34c342e9c9cf35c2d67fd1ec3e4fec/packages/bun-sqlite/src/connection.ts#L355)

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
