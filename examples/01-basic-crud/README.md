# Basic CRUD Example

This example demonstrates the fundamental CRUD (Create, Read, Update, Delete) operations using Rinari ORM with SQLite.

## What You'll Learn

- Setting up the ORM with SQLite driver
- Defining a model with schema
- Creating records
- Reading records with various queries
- Updating records
- Deleting records

## Running the Example

```bash
npm install
npm start
```

## Code Walkthrough

### 1. Initialize the ORM

```javascript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});
```

### 2. Define a Model

```javascript
const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true },
  age: { type: DataTypes.INTEGER },
});
```

### 3. Create Records

```javascript
const user = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
});
```

### 4. Read Records

```javascript
const allUsers = User.findAll();
const alice = User.findOne({ where: { username: 'alice' } });
const adults = User.findAll({ where: { age: { $gte: 18 } } });
```

### 5. Update Records

```javascript
User.update({ age: 26 }, { username: 'alice' });
```

### 6. Delete Records

```javascript
User.delete({ username: 'charlie' });
```

## Learn More

- [Rinari Documentation](../../docs/README.md)
- [Getting Started Guide](../../docs/guide/getting-started.md)
- [Core Concepts](../../docs/guide/core-concepts.md)
