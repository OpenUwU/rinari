# Bun SQLite Basic Example

A comprehensive example demonstrating all features of the Rinari ORM with the
Bun SQLite driver.

## Features Demonstrated

- **CREATE**: Single and bulk record insertion
- **READ**: Finding single and multiple records with filtering
- **UPDATE**: Single and bulk record updates
- **DELETE**: Removing records
- **AGGREGATIONS**: COUNT, AVG, MAX, MIN operations
- **TRANSACTIONS**: Atomic operations with automatic rollback
- **INDEXES**: Creating indexes for performance
- **QUERY OPERATORS**: Using $gte, $lt, $in, $like, etc.

## Requirements

- **Bun** runtime (>=1.0.0)
- This example will **not** work with Node.js

## Installation

```bash
# Install dependencies
bun install
```

## Running the Example

```bash
bun run start
```

## What It Does

The example will:

1. Create a SQLite database in `./data/default.sqlite`
2. Define a User model with schema
3. Create indexes for better query performance
4. Perform CRUD operations:
   - Insert single users
   - Bulk insert multiple users
   - Query users with various filters
   - Update user records
   - Delete inactive users
5. Demonstrate aggregation functions
6. Show transaction usage for atomic operations
7. Display final state of all users

## Expected Output

You should see console output showing:

```
🚀 Rinari ORM - Bun SQLite Driver Example

📋 CREATE - Inserting users...
✅ Created user: alice (ID: 1)
✅ Created user: bob (ID: 2)

📚 BULK CREATE - Inserting multiple users...
✅ Bulk created 3 users

🔍 READ - Finding users...
Found user by username: { id: 1, username: 'alice', ... }

Found 4 active users:
  - charlie (age: 22)
  - alice (age: 25)
  - diana (age: 28)
  - bob (age: 30)

📊 AGGREGATIONS - Computing statistics...
Total users: 6
Active users: 5
Average age: 28.3
Maximum age: 40
Minimum age: 22

✏️ UPDATE - Updating user status...
Updated 1 user(s) to premium status
Bulk updated 2 user(s)

🔄 TRANSACTIONS - Testing atomic operations...
✅ Transaction succeeded: Created frank and verified

🗑️ DELETE - Removing inactive users...
Deleted 1 inactive user(s)

📝 FINAL STATE - All remaining users:
  ID: 1 | alice | alice@example.com | Age: 25 | Status: premium
  ID: 2 | bob | bob@example.com | Age: 30 | Status: premium
  ID: 3 | charlie | charlie@example.com | Age: 23 | Status: active
  ID: 4 | diana | diana@example.com | Age: 28 | Status: active
  ID: 6 | frank | frank@example.com | Age: 40 | Status: verified

✨ Example completed successfully!
```

## Performance Notes

This example uses Bun's native SQLite driver which is:

- **3-6x faster** than better-sqlite3 for read queries
- **8-9x faster** than deno.land/x/sqlite
- Optimized with WAL mode for better concurrency
- Zero external dependencies (uses native Bun APIs)

## Code Walkthrough

### 1. Initialize Driver and ORM

```typescript
const driver = new BunSQLiteDriver({
  storageDir: './data',
  verbose: false,
});

const orm = new ORM({ driver });
```

### 2. Define Model

```typescript
const User = orm.define<User>('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true },
  age: { type: DataTypes.INTEGER },
  status: { type: DataTypes.TEXT, default: 'active' },
  createdAt: { type: DataTypes.DATETIME, notNull: true },
});
```

### 3. Create Index

```typescript
User.createIndex('idx_status_created', {
  columns: ['status', 'createdAt'],
});
```

### 4. CRUD Operations

```typescript
// Create
const user = User.create({ username: 'alice', email: 'alice@example.com' });

// Read
const found = User.findOne({ where: { username: 'alice' } });
const active = User.findAll({ where: { status: 'active' } });

// Update
User.update({ status: 'premium' }, { username: 'alice' });

// Delete
User.delete({ status: 'inactive' });
```

### 5. Transactions

```typescript
orm.getDriver().transaction(() => {
  const user = User.create({ username: 'frank', ... });
  User.update({ status: 'verified' }, { id: user.id });
  return user;
});
```

## Learn More

- [Rinari Documentation](../../docs/README.md)
- [Bun SQLite Driver Guide](../../docs/guide/driver/bun-sqlite.md)
- [ORM Core Concepts](../../docs/guide/core-concepts.md)
- [Bun SQLite API Reference](https://bun.sh/docs/api/sqlite)
