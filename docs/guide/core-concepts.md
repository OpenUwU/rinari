# Core Concepts

Understanding these core concepts will help you use Rinari effectively.

## Architecture Overview

Rinari follows a layered architecture:

```
┌─────────────────────────────────────┐
│      Your Application Code          │
└───────────────┬─────────────────────┘
                │
        ┌───────▼────────┐
        │  ORM Instance  │  ◄── Manages models & databases
        └───────┬────────┘
                │
        ┌───────▼─────────┐
        │  Models (Tables)│  ◄── Provide CRUD operations
        └───────┬─────────┘
                │
        ┌───────▼────────┐
        │  Driver        │  ◄── Database-specific implementation
        └────────────────┘
```

## Key Components

### 1. ORM

The `ORM` class is the central component that:

- Manages database connections via drivers
- Tracks defined models
- Provides access to models
- Handles multi-database scenarios

```typescript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});
```

### 2. Models

Models represent database tables and provide methods for:

- Creating records (`create`, `bulkCreate`)
- Reading records (`findOne`, `findAll`, `findById`)
- Updating records (`update`, `bulkUpdate`)
- Deleting records (`delete`, `bulkDelete`)
- Aggregations (`sum`, `avg`, `min`, `max`)
- Transactions
- Index management

```typescript
const User = orm.define('default', 'users', schema);
```

### 3. Drivers

Drivers implement database-specific operations. They can be:

- **Synchronous** (`SyncDriver`) - like SQLite
- **Asynchronous** (`AsyncDriver`) - like MongoDB

```typescript
const sqliteDriver = new SQLiteDriver({ storageDir: './data' });
```

### 4. Schemas

Schemas define table structure using column definitions:

```typescript
const userSchema = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true },
};
```

## Data Flow

### Creating a Record

```
User.create(data)
     ↓
Model.create()
     ↓
Driver.insert()
     ↓
Database
     ↓
Return created record
```

### Querying Records

```
User.findAll(options)
     ↓
Model.findAll()
     ↓
Driver.findAll()
     ↓
Database
     ↓
Return matching records
```

## Type Safety

Rinari provides full TypeScript support:

```typescript
interface User {
  id: number;
  username: string;
  email: string;
}

const User = orm.define<User>('default', 'users', schema);

const user: User = User.create({
  username: 'alice',
  email: 'alice@example.com',
});
const users: User[] = User.findAll();
```

## Multi-Database Support

Rinari can manage multiple databases simultaneously:

```typescript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

const User = orm.define('users_db', 'users', userSchema);
const Post = orm.define('content_db', 'posts', postSchema);
const Event = orm.define('analytics_db', 'events', eventSchema);

console.log(orm.getDatabases()); // ['users_db', 'content_db', 'analytics_db']
```

Each database gets its own file:

- `./data/users_db.sqlite`
- `./data/content_db.sqlite`
- `./data/analytics_db.sqlite`

## Query System

### Basic Queries

Simple equality matching:

```typescript
User.findAll({
  where: { status: 'active', verified: true },
});
```

### Advanced Operators

Use operators for complex conditions:

```typescript
User.findAll({
  where: {
    age: { $gte: 18, $lt: 65 },
    role: { $in: ['admin', 'moderator'] },
    username: { $like: '%john%' },
  },
});
```

### Sorting and Pagination

```typescript
User.findAll({
  orderBy: [
    ['createdAt', 'DESC'],
    ['username', 'ASC'],
  ],
  limit: 10,
  offset: 20,
});
```

### Field Selection

```typescript
User.findAll({
  select: ['id', 'username', 'email'],
});
```

## Transactions

Transactions ensure data consistency:

```typescript
User.transaction(() => {
  const user = User.create({ username: 'alice', email: 'alice@example.com' });
  Profile.create({ userId: user.id, bio: 'Hello World' });
  return user;
});
```

If any operation fails, all changes are rolled back.

## Indexes

Indexes improve query performance:

```typescript
User.createIndex('idx_email', {
  unique: true,
  columns: ['email'],
});

User.createIndex('idx_status_created', {
  columns: ['status', 'createdAt'],
});
```

## Data Types

Rinari provides database-agnostic data types:

| Type       | Description    | Example                  |
| ---------- | -------------- | ------------------------ |
| `INTEGER`  | Whole numbers  | `42`                     |
| `TEXT`     | Strings        | `"hello"`                |
| `REAL`     | Floating point | `3.14`                   |
| `BOOLEAN`  | True/false     | `true`                   |
| `DATE`     | Date only      | `"2024-01-01"`           |
| `DATETIME` | Date and time  | `"2024-01-01T12:00:00Z"` |
| `JSON`     | JSON objects   | `{ "key": "value" }`     |
| `BLOB`     | Binary data    | `Buffer`                 |

## Best Practices

1. **Define Types**: Always use TypeScript interfaces for type safety
2. **Use Transactions**: Batch related operations in transactions
3. **Create Indexes**: Index frequently queried columns
4. **Select Fields**: Only select fields you need
5. **Bulk Operations**: Use bulk methods for multiple records
6. **Close Connections**: Always call `orm.disconnect()` when done

## Next Steps

- [Models Guide](./orm/models.md)
- [SQLite Driver](./driver/sqlite.md)
- [Type System Overview](./types/overview.md)
- [API Documentation](../api/README.md)
