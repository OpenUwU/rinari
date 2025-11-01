# Rinari Documentation

Welcome to Rinari! Whether you are brand new to ORMs or an experienced
developer, this documentation will help you build database applications.

## Start Here

**New to Rinari?** Follow this path:

1. [Quick Start Tutorial](./guide/tutorials/quick-start.md) - Build your first
   app in 10 minutes
2. [Core Concepts](./guide/core-concepts.md) - Understand how Rinari works
3. [Building Your First App](./guide/tutorials/building-your-first-app.md) -
   Create a real task manager
4. [Common Patterns](./guide/tutorials/common-patterns.md) - Learn best
   practices

**Already familiar?** Jump to what you need:

- [Examples](#examples) - Complete, runnable examples
- [Guides](#guides) - In-depth feature guides

## Examples

Learn by doing! Each example is complete and ready to run.

| Example                                                                               | Description                         | What You'll Learn                     |
| ------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------- |
| [Basic CRUD](https://github.com/OpenUwU/rinari/tree/main/examples/01-basic-crud)      | Simple create, read, update, delete | Perfect starting point for beginners  |
| [Todo List](https://github.com/OpenUwU/rinari/tree/main/examples/02-todo-list)        | Task management app                 | Indexes, sorting, filtering, counting |
| [Discord Bot](https://github.com/OpenUwU/rinari/tree/main/examples/discord-notes-bot) | Note-taking Discord bot             | Real-world integration, search, tags  |

Every example includes:

- Complete JavaScript code
- Detailed README with explanations
- Step-by-step walkthrough
- Ready to customize

## Tutorials

**Step-by-step guides to mastering Rinari:**

### Beginner Tutorials

- **[Quick Start Tutorial](./guide/tutorials/quick-start.md)** - Your first
  Rinari app (10 minutes)
- **[Building Your First App](./guide/tutorials/building-your-first-app.md)** -
  Complete task manager from scratch
- **[Common Patterns](./guide/tutorials/common-patterns.md)** - Best practices
  and patterns

### Core Guides

- **[Getting Started](./guide/getting-started.md)** - Installation and basic
  usage
- **[Core Concepts](./guide/core-concepts.md)** - Architecture and fundamentals
- **[Working with Models](./guide/orm/models.md)** - CRUD operations, queries,
  and more

### Advanced Topics

- [Driver System](./guide/driver/overview.md) - Understanding how drivers work
- [SQLite Driver](./guide/driver/sqlite.md) - Deep dive into SQLite
- [Type System](./guide/types/overview.md) - TypeScript integration

## Guides

### Getting Started

- [Installation & Setup](./guide/getting-started.md)
- [Core Concepts](./guide/core-concepts.md)

### Working with Models

- [Models Guide](./guide/orm/models.md) - CRUD operations
- [Query Operators](./guide/core-concepts.md#query-operators)
- [Transactions](./guide/core-concepts.md#transactions)
- [Aggregations](./guide/core-concepts.md#aggregations)

### Drivers

- [Driver Overview](./guide/driver/overview.md)
- [SQLite Driver](./guide/driver/sqlite.md)

### Type System

- [Type System Overview](./guide/types/overview.md)

## Package Documentation

| Package                                                                       | README                                                                          | Description                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| [@rinari/types](https://github.com/OpenUwU/rinari/tree/main/packages/types)   | [README](https://github.com/OpenUwU/rinari/blob/main/packages/types/README.md)  | Core TypeScript type definitions |
| [@rinari/orm](https://github.com/OpenUwU/rinari/tree/main/packages/orm)       | [README](https://github.com/OpenUwU/rinari/blob/main/packages/orm/README.md)    | Core ORM with Model management   |
| [@rinari/sqlite](https://github.com/OpenUwU/rinari/tree/main/packages/sqlite) | [README](https://github.com/OpenUwU/rinari/blob/main/packages/sqlite/README.md) | High-performance SQLite driver   |

## Quick Example

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

// 1. Initialize
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

// 2. Define your model
const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true },
});

// 3. Use it!
const alice = User.create({
  username: 'alice',
  email: 'alice@example.com',
});

const users = User.findAll({
  where: { username: { $like: '%alice%' } },
});

orm.disconnect();
```

Start with the [Quick Start Tutorial](./guide/tutorials/quick-start.md) to learn
more.

## Learning Paths

### Path 1: Complete Beginner

If you're new to Rinari and ORMs:

1. [Quick Start Tutorial](./guide/tutorials/quick-start.md) - 10 minutes
2. [Basic CRUD Example](../examples/01-basic-crud) - Run and explore
3. [Core Concepts](./guide/core-concepts.md) - Understand the basics
4. [Todo List Example](../examples/02-todo-list) - Build something useful
5. [Building Your First App](./guide/tutorials/building-your-first-app.md) -
   Complete project
6. [Common Patterns](./guide/tutorials/common-patterns.md) - Best practices

### Path 2: Experienced Developer

If you know ORMs and want to get productive fast:

1. [Core Concepts](./guide/core-concepts.md) - Understand Rinari's architecture
2. [Models Guide](./guide/orm/models.md) - Learn the API
3. [Blog System Example](../examples/03-blog-system) - See patterns in action
4. [Common Patterns](./guide/tutorials/common-patterns.md) - Advanced techniques

### Path 3: Building a Specific Project

Jump straight to what you need:

- **Discord Bot** -
  [Discord Notes Bot Example](https://github.com/OpenUwU/rinari/tree/main/examples/discord-notes-bot)
- **CLI Tool** -
  [Todo List Example](https://github.com/OpenUwU/rinari/tree/main/examples/02-todo-list)
- **Data Analytics** - [Models Guide](./guide/orm/models.md)

## Common Tasks

Quick links to common operations:

**Basic Operations:**

- [Create records](./guide/orm/models.md#creating-records)
- [Find records](./guide/orm/models.md#querying-records)
- [Update records](./guide/orm/models.md#updating-records)
- [Delete records](./guide/orm/models.md#deleting-records)

**Advanced:**

- [Transactions](./guide/core-concepts.md#transactions)
- [Aggregations](./guide/core-concepts.md#aggregations)
- [Indexes](./guide/driver/sqlite.md#indexes)
- [Bulk operations](./guide/orm/models.md#bulk-operations)

**Patterns:**

- [Model relationships](./guide/tutorials/common-patterns.md#model-relationships)
- [Pagination](./guide/tutorials/common-patterns.md#pagination)
- [Search and filtering](./guide/tutorials/common-patterns.md#search--filtering)
- [Soft deletes](./guide/tutorials/common-patterns.md#soft-deletes)

## External Resources

- [GitHub Repository](https://github.com/OpenUwU/rinari)
- [NPM Package - @rinari/orm](https://www.npmjs.com/package/@rinari/orm)
- [NPM Package - @rinari/sqlite](https://www.npmjs.com/package/@rinari/sqlite)
- [NPM Package - @rinari/types](https://www.npmjs.com/package/@rinari/types)
- [Discord Community](https://discord.gg/zqxWVH3CvG)
- [API Documentation](https://github.com/OpenUwU/rinari/tree/main/docs/api)

## License

OpenUwU Open License (OUOL-1.0) - see
[LICENSE](https://github.com/OpenUwU/rinari/blob/main/LICENSE) file for details.

---

**Built by the [OpenUwU](https://github.com/OpenUwU) team**

[GitHub](https://github.com/OpenUwU) | [Discord](https://discord.gg/zqxWVH3CvG)
