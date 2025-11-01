# Todo List Example

A practical todo list application demonstrating intermediate Rinari ORM
features.

## Features

- Create todos with title, description, priority, and due dates
- Mark todos as completed
- Filter todos by completion status
- Priority-based sorting
- Statistics and analytics
- Database indexes for performance

## What You'll Learn

- Using default values in schema
- Creating database indexes
- Complex WHERE queries
- Sorting with multiple criteria
- Counting records with conditions
- Building helper functions for common operations

## Running the Example

```bash
npm install
npm start
```

## Key Concepts

### Schema with Defaults

```javascript
const Todo = orm.define('default', 'todos', {
  completed: { type: DataTypes.INTEGER, notNull: true, default: 0 },
  priority: { type: DataTypes.TEXT, default: 'medium' },
});
```

### Creating Indexes

```javascript
Todo.createIndex('idx_completed', { columns: ['completed'] });
Todo.createIndex('idx_priority', { columns: ['priority'] });
```

### Complex Queries

```javascript
const todos = Todo.findAll({
  where: { priority: 'high', completed: 0 },
  orderBy: [
    ['completed', 'ASC'],
    ['priority', 'DESC'],
    ['createdAt', 'ASC'],
  ],
});
```

### Counting Records

```javascript
const total = Todo.count();
const completed = Todo.count({ completed: 1 });
const highPriority = Todo.count({ completed: 0, priority: 'high' });
```

## Next Steps

- Add categories or tags
- Implement due date reminders
- Add bulk operations
- Create a REST API

## Learn More

- [Rinari Documentation](../../docs/README.md)
- [Models Guide](../../docs/guide/orm/models.md)
- [Query Operators](../../docs/guide/core-concepts.md)
