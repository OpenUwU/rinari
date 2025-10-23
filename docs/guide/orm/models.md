# Models Guide

Models are the core of Rinari, providing an object-oriented interface to your
database tables.

## Defining Models

### Basic Model Definition

```typescript
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
  status: { type: DataTypes.TEXT, default: 'active' },
});
```

### TypeScript-Typed Models

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  age?: number;
  status?: string;
}

const User = orm.define<User>('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true, unique: true },
  age: { type: DataTypes.INTEGER },
  status: { type: DataTypes.TEXT, default: 'active' },
});

const user: User = User.create({
  username: 'alice',
  email: 'alice@example.com',
});
```

## Column Options

### Primary Keys

```typescript
{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}
```

### Constraints

```typescript
{
  email: {
    type: DataTypes.TEXT,
    notNull: true,    // Cannot be NULL
    unique: true      // Must be unique
  },
  age: {
    type: DataTypes.INTEGER,
    default: 18       // Default value
  }
}
```

### Foreign Keys

```typescript
const Post = orm.define('default', 'posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    notNull: true,
    references: {
      table: 'users',
      column: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  title: { type: DataTypes.TEXT, notNull: true },
});
```

## CRUD Operations

### Create

```typescript
const user = User.create({
  username: 'alice',
  email: 'alice@example.com',
  age: 25,
});

console.log(user.id); // Auto-generated ID
```

### Read

```typescript
const user = User.findById(1);

const specificUser = User.findOne({
  where: { username: 'alice' },
});

const allUsers = User.findAll({
  where: { age: { $gte: 18 } },
  orderBy: [['username', 'ASC']],
  limit: 10,
});
```

### Update

```typescript
const updated = User.update(
  { age: 26, status: 'verified' },
  { username: 'alice' }
);

console.log(`Updated ${updated} records`);
```

### Delete

```typescript
const deleted = User.delete({ status: 'inactive' });
console.log(`Deleted ${deleted} records`);
```

## Bulk Operations

### Bulk Create

```typescript
const users = User.bulkCreate([
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' },
  { username: 'charlie', email: 'charlie@example.com' },
]);

console.log(`Created ${users.length} users`);
```

### Bulk Update

```typescript
const updated = User.bulkUpdate([
  { where: { id: 1 }, data: { status: 'active' } },
  { where: { id: 2 }, data: { status: 'inactive' } },
  { where: { id: 3 }, data: { status: 'banned' } },
]);
```

### Bulk Delete

```typescript
const deleted = User.bulkDelete([
  { status: 'deleted' },
  { age: { $lt: 13 } },
  { createdAt: { $lt: '2020-01-01' } },
]);
```

## Aggregations

### Sum

```typescript
const totalAge = User.sum('age');
const activeAge = User.sum('age', { status: 'active' });
```

### Average

```typescript
const avgAge = User.avg('age');
console.log(`Average user age: ${avgAge}`);
```

### Min/Max

```typescript
const minAge = User.min('age');
const maxAge = User.max('age');
console.log(`Age range: ${minAge} - ${maxAge}`);
```

### Count

```typescript
const total = User.count();
const activeCount = User.count({ status: 'active' });
```

## Transactions

### Basic Transaction

```typescript
const result = User.transaction(() => {
  const user = User.create({ username: 'alice', email: 'alice@example.com' });
  Profile.create({ userId: user.id, bio: 'Hello World' });
  return user;
});
```

### Error Handling

```typescript
try {
  User.transaction(() => {
    User.create({ username: 'alice', email: 'alice@example.com' });
    throw new Error('Rollback!');
  });
} catch (error) {
  console.log('Transaction rolled back');
}
```

## Indexes

### Simple Index

```typescript
User.createIndex('idx_email', {
  columns: ['email'],
});
```

### Unique Index

```typescript
User.createIndex('idx_username', {
  unique: true,
  columns: ['username'],
});
```

### Composite Index

```typescript
User.createIndex('idx_status_created', {
  columns: ['status', 'createdAt'],
});
```

### Partial Index

```typescript
User.createIndex('idx_active_users', {
  columns: ['createdAt'],
  where: "status = 'active'",
});
```

### Drop Index

```typescript
User.dropIndex('idx_email');
```

## Model Properties

### Get Table Name

```typescript
console.log(User.table); // "users"
```

### Get Database Name

```typescript
console.log(User.database); // "default"
```

## Best Practices

1. **Use TypeScript interfaces** for type safety
2. **Define indexes** on frequently queried columns
3. **Use transactions** for related operations
4. **Validate data** before creation
5. **Handle errors** appropriately
6. **Use bulk operations** for efficiency

## Common Patterns

### Validation Pattern

```typescript
function createUser(data: Partial<User>) {
  if (!data.username || data.username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  return User.create(data);
}
```

### Soft Delete Pattern

```typescript
const schema = {
  // ... other fields
  deletedAt: { type: DataTypes.DATETIME, default: null },
};

function softDelete(userId: number) {
  return User.update({ deletedAt: new Date().toISOString() }, { id: userId });
}

function findActive() {
  return User.findAll({
    where: { deletedAt: null },
  });
}
```

### Audit Pattern

```typescript
const schema = {
  // ... other fields
  createdAt: { type: DataTypes.DATETIME },
  updatedAt: { type: DataTypes.DATETIME },
};

function createWithTimestamps(data: any) {
  const now = new Date().toISOString();
  return User.create({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

function updateWithTimestamp(data: any, where: any) {
  return User.update(
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    where
  );
}
```

## Next Steps

- [SQLite Driver](../driver/sqlite.md)
- [Core Concepts](../core-concepts.md)
- [API Documentation](../../api/README.md)
