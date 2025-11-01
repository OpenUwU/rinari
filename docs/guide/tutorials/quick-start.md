# Quick Start Tutorial

Welcome to Rinari! This tutorial will help you build your first database
application from scratch in just 10 minutes.

## What You Will Build

A simple user management system where you can:

- Create new users
- Find users by different criteria
- Update user information
- Delete users

## Prerequisites

- Node.js 18+ or Bun 1.0+ installed
- Basic JavaScript knowledge
- A text editor or IDE

## Step 1: Install Rinari

Create a new directory and initialize your project:

```bash
mkdir my-rinari-app
cd my-rinari-app
npm init -y
```

Install Rinari packages:

```bash
npm install @rinari/orm @rinari/sqlite
```

## Step 2: Create Your First File

Create a file called `index.js`:

```bash
touch index.js
```

Add this to your `package.json` to enable ES modules:

```json
{
  "type": "module"
}
```

## Step 3: Import Rinari

Open `index.js` and add these imports:

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';
```

**What does each import do?**

- `ORM` - The main class that manages your database
- `SQLiteDriver` - Handles the SQLite database connection
- `DataTypes` - Provides data type definitions for your models

## Step 4: Initialize the Database

Add this code to initialize the ORM:

```javascript
const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});
```

This creates a new ORM instance using SQLite. The `storageDir` option tells
Rinari where to store your database files (it will create a `data` folder
automatically).

## Step 5: Define Your Model

A model represents a table in your database. Let's create a User model:

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

**Breaking it down:**

- `'default'` - The database name (you can have multiple databases)
- `'users'` - The table name
- The third parameter defines the table structure:
  - `id` - Auto-incrementing primary key
  - `username` - Required and must be unique
  - `email` - Required and must be unique
  - `age` - Optional integer field
  - `createdAt` - Optional timestamp field

## Step 6: Create Records

Now let's add some users:

```javascript
console.log('Creating users...');

const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
  createdAt: new Date().toISOString(),
});

const bob = User.create({
  username: 'bob',
  email: 'bob@example.com',
  age: 30,
  createdAt: new Date().toISOString(),
});

console.log('Created users:', alice, bob);
```

## Step 7: Read Records

Let's find users in different ways:

```javascript
console.log('\nFinding all users...');
const allUsers = User.findAll();
console.log(`Found ${allUsers.length} users:`, allUsers);

console.log('\nFinding user by username...');
const foundUser = User.findOne({ where: { username: 'alice' } });
console.log('Found:', foundUser);

console.log('\nFinding users aged 25 or older...');
const adults = User.findAll({
  where: { age: { $gte: 25 } },
  orderBy: [['age', 'ASC']],
});
console.log('Adults:', adults);
```

## Step 8: Update Records

Update a user's information:

```javascript
console.log('\nUpdating user...');
const updated = User.update({ age: 26 }, { username: 'alice' });

console.log(`Updated ${updated} record(s)`);

const updatedAlice = User.findOne({ where: { username: 'alice' } });
console.log('Updated user:', updatedAlice);
```

## Step 9: Delete Records

Remove a user:

```javascript
console.log('\nDeleting user...');
const deleted = User.delete({ username: 'bob' });
console.log(`Deleted ${deleted} record(s)`);

const remainingUsers = User.findAll();
console.log('Remaining users:', remainingUsers);
```

## Step 10: Clean Up

Always disconnect when you're done:

```javascript
orm.disconnect();
console.log('\nDisconnected from database');
```

## Complete Code

Here's the complete `index.js` file:

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});

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

console.log('Creating users...');
const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
  createdAt: new Date().toISOString(),
});

const bob = User.create({
  username: 'bob',
  email: 'bob@example.com',
  age: 30,
  createdAt: new Date().toISOString(),
});

console.log('Created users:', alice, bob);

console.log('\nFinding all users...');
const allUsers = User.findAll();
console.log(`Found ${allUsers.length} users:`, allUsers);

console.log('\nFinding user by username...');
const foundUser = User.findOne({ where: { username: 'alice' } });
console.log('Found:', foundUser);

console.log('\nFinding users aged 25 or older...');
const adults = User.findAll({
  where: { age: { $gte: 25 } },
  orderBy: [['age', 'ASC']],
});
console.log('Adults:', adults);

console.log('\nUpdating user...');
const updated = User.update({ age: 26 }, { username: 'alice' });
console.log(`Updated ${updated} record(s)`);

const updatedAlice = User.findOne({ where: { username: 'alice' } });
console.log('Updated user:', updatedAlice);

console.log('\nDeleting user...');
const deleted = User.delete({ username: 'bob' });
console.log(`Deleted ${deleted} record(s)`);

const remainingUsers = User.findAll();
console.log('Remaining users:', remainingUsers);

orm.disconnect();
console.log('\nDisconnected from database');
```

## Run Your App

```bash
node index.js
```

You should see output showing all the database operations!

## What You Have Learned

- How to install Rinari
- How to initialize the ORM
- How to define models
- How to create records
- How to read records with queries
- How to update records
- How to delete records
- How to disconnect from the database

## Next Steps

Now that you have built your first app, try:

1. **Add More Fields** - Try adding fields like `phoneNumber`, `address`, or
   `role`
2. **Use More Operators** - Try `$like`, `$in`, `$between` for queries
3. **Create Another Model** - Add a Profile or Post model
4. **Explore Examples** - Check out the
   [Todo List](https://github.com/OpenUwU/rinari/tree/main/examples/02-todo-list)
   or
   [Discord Bot](https://github.com/OpenUwU/rinari/tree/main/examples/discord-notes-bot)
   examples
5. **Learn Advanced Features** - Read about
   [transactions, aggregations, and indexes](../core-concepts.md)

## Need Help?

- Read the [Core Concepts](../core-concepts.md) guide
- Check the
  [API Reference](https://github.com/OpenUwU/rinari/tree/main/docs/api)
- Look at more [examples](https://github.com/OpenUwU/rinari/tree/main/examples)
