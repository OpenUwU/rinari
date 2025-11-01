# Getting Started with Rinari

Welcome to Rinari! This guide will help you set up and start using the Rinari
ORM in your project.

## Installation

Install the core ORM package and a driver:

```bash
npm install @rinari/orm @rinari/sqlite
```

The types are included automatically if you're using TypeScript. For JavaScript
projects, everything just works!

## Your First Application

Let's build a simple user management system.

### Step 1: Initialize the ORM

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});
```

### Step 2: Define Your Model

```javascript
const User = orm.define('default', 'users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  createdAt: {
    type: DataTypes.DATETIME,
  },
});
```

### Step 3: Create Records

```javascript
const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
  createdAt: new Date().toISOString(),
});

console.log('Created user:', alice);
```

### Step 4: Query Records

```javascript
const user = User.findOne({
  where: { username: 'alice' },
});

const adults = User.findAll({
  where: { age: { $gte: 18 } },
  orderBy: [['username', 'ASC']],
});

console.log(`Found ${adults.length} adult users`);
```

### Step 5: Update Records

```javascript
const updated = User.update({ age: 26 }, { username: 'alice' });

console.log(`Updated ${updated} record(s)`);
```

### Step 6: Delete Records

```javascript
const deleted = User.delete({
  age: { $lt: 13 },
});

console.log(`Deleted ${deleted} underage users`);
```

### Step 7: Clean Up

```javascript
orm.disconnect();
```

## Complete Example

Here's a complete working example you can save and run:

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true },
  age: { type: DataTypes.INTEGER },
  createdAt: { type: DataTypes.DATETIME },
});

console.log('Creating users...');
const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
  createdAt: new Date().toISOString(),
});
console.log('Created:', alice);

const bob = User.create({
  username: 'bob',
  email: 'bob@example.com',
  age: 30,
  createdAt: new Date().toISOString(),
});
console.log('Created:', bob);

console.log('\nFinding users...');
const found = User.findOne({ where: { username: 'alice' } });
console.log('Found:', found);

const adults = User.findAll({
  where: { age: { $gte: 18 } },
  orderBy: [['age', 'ASC']],
});
console.log(`Adults (${adults.length}):`, adults);

console.log('\nUpdating user...');
User.update({ age: 26 }, { username: 'alice' });
console.log("Updated alice's age to 26");

console.log('\nAll users:');
const all = User.findAll();
console.log(`Total users: ${all.length}`);
all.forEach((u) => console.log(`  - ${u.username} (${u.age} years old)`));

orm.disconnect();
console.log('\nDone!');
```

## Next Steps

- Learn about [Core Concepts](./core-concepts.md)
- Explore [Models in depth](./orm/models.md)
- Understand [SQLite Driver](./driver/sqlite.md)
- Read the [API Documentation](../api/README.md)

## Common Patterns

### Using Transactions

```javascript
User.transaction(() => {
  const user1 = User.create({ username: 'alice', email: 'alice@example.com' });
  const user2 = User.create({ username: 'bob', email: 'bob@example.com' });
  return [user1, user2];
});
```

### Bulk Operations

```javascript
const users = User.bulkCreate([
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' },
  { username: 'user3', email: 'user3@example.com' },
]);
```

### Counting Records

```javascript
const total = User.count();
const activeCount = User.count({ status: 'active' });
```

## Troubleshooting

### Database file not found

The `storageDir` directory will be created automatically by Rinari when you
first use the ORM. If you need to create it manually:

```javascript
import { mkdirSync, existsSync } from 'fs';

const dataDir = './data';
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
```

### ES Module errors

If you get "Cannot use import statement outside a module" error, make sure your
`package.json` has:

```json
{
  "type": "module"
}
```

## Help & Support

- [Documentation](../README.md)
- [GitHub Issues](https://github.com/OpenUwU/rinari/issues)
- [Discord Community](https://discord.gg/zqxWVH3CvG)
