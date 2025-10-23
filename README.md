
<p align="center">
  <a href="https://github.com/OpenUwU/rinari/">
    <img src="https://raw.githubusercontent.com/OpenUwU/rinari/refs/heads/main/10207.png" alt="rinari"/>
  </a>
# Rinari

**Lightweight, high-performance ORM for JavaScript and TypeScript**

<p align="center">
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=Node.js&logoColor=white" alt="Node.js"/>
  </a>
  <a href="https://bun.sh/">
    <img src="https://img.shields.io/badge/Bun-1.0+-FF4F00?style=for-the-badge&logo=Bun&logoColor=white" alt="Bun"/>
  </a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="https://github.com/OpenUwU/rinari/blob/main/docs/README.md">Documentation</a> •
  <a href="#examples">Examples</a> •
  <a href="https://discord.gg/zqxWVH3CvG">Discord</a>
</p>

## Why Rinari?

Modern ORM built for simplicity and speed. Zero dependencies in core, full TypeScript support, works with SQLite out of the box.

**Perfect for:** Discord bots, REST APIs, CLI tools, data analytics, rapid prototyping

## Installation

```bash
npm install @rinari/orm @rinari/sqlite
```

## Quick Start

```javascript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

// 1. Initialize
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

// 2. Define model
const User = orm.define('default', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true, unique: true },
  email: { type: DataTypes.TEXT, notNull: true },
  age: { type: DataTypes.INTEGER },
});

// 3. Use it
const user = User.create({ username: 'alice', email: 'alice@example.com', age: 25 });
const adults = User.findAll({ where: { age: { $gte: 18 } } });

orm.disconnect();
```

[See full tutorial →](https://github.com/OpenUwU/rinari/blob/main/docs/guide/tutorials/quick-start.md)

## Features

### Core Capabilities
- **Multi-database support** - Manage multiple databases in one app
- **Zero core dependencies** - Minimal footprint, maximum performance
- **Type-safe** - Full TypeScript inference
- **Transactions** - ACID-compliant data operations
- **Pluggable drivers** - SQLite included, custom drivers supported

### Query & Data Operations
```javascript
// Rich query operators
User.findAll({
  where: {
    age: { $gte: 18, $lt: 65 },
    username: { $like: '%john%' },
    status: { $in: ['active', 'premium'] }
  },
  orderBy: [['age', 'DESC']],
  limit: 10
});

// Aggregations
const total = Order.sum('amount');
const avgAge = User.avg('age');
const count = User.count({ status: 'active' });

// Bulk operations
User.bulkCreate([
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' }
]);

// Indexes for performance
User.createIndex('idx_username', { columns: ['username'] });
```

**Operators:** `$eq` `$ne` `$gt` `$gte` `$lt` `$lte` `$in` `$nin` `$like` `$between`

## Database Drivers

### Official Drivers

**SQLite** - `@rinari/sqlite`
High-performance synchronous operations powered by `better-sqlite3`. Perfect for local storage, Discord bots, and desktop applications.

[View SQLite Driver Documentation →](./docs/guide/driver/sqlite.md)

### Community Drivers

Want to contribute a driver for PostgreSQL, MySQL, MongoDB, or another database? We'd love to feature it here!

- Open a pull request with your driver
- Join our [Discord](https://discord.gg/zqxWVH3CvG) to discuss implementation

[Learn how to build a custom driver →](./docs/guide/driver/custom.md)

## Examples

### [Basic CRUD](./examples/01-basic-crud)
Learn fundamentals with create, read, update, delete operations

### [Todo List App](./examples/02-todo-list)
Task management with priorities, filtering, and sorting

### [Discord Bot](./examples/discord-notes-bot)
Production-ready note-taking bot showing real-world integration

## Real-World Usage

**Discord Bot - User Economy**
```javascript
const User = orm.define('default', 'users', {
  userId: { type: DataTypes.TEXT, notNull: true, unique: true },
  coins: { type: DataTypes.INTEGER, default: 0 },
  level: { type: DataTypes.INTEGER, default: 1 }
});

User.findOne({ where: { userId: '123456789' } });
```

**REST API Endpoint**
```javascript
app.get('/users/:id', (req, res) => {
  const user = User.findById(req.params.id);
  res.json(user);
});
```

**Analytics Dashboard**
```javascript
const revenue = Order.sum('amount', { status: 'completed' });
const topProducts = Product.findAll({ 
  orderBy: [['sales', 'DESC']], 
  limit: 10 
});
```

## Documentation

**Getting Started**
- [Quick Start Guide](https://github.com/OpenUwU/rinari/blob/main/docs/guide/tutorials/quick-start.md) - 10 minute tutorial
- [Core Concepts](https://github.com/OpenUwU/rinari/blob/main/docs/guide/core-concepts.md) - How Rinari works

**Package Docs**
- [@rinari/types](https://github.com/OpenUwU/rinari/tree/main/packages/types) - Type definitions
- [@rinari/orm](https://github.com/OpenUwU/rinari/tree/main/packages/orm) - Core ORM
- [@rinari/sqlite](https://github.com/OpenUwU/rinari/tree/main/packages/sqlite) - SQLite driver

**Drivers**
- [SQLite Driver](./docs/guide/driver/sqlite.md) - Official driver documentation
- [Custom Drivers](./docs/guide/driver/custom.md) - Build your own driver

## Packages

| Package | Description |
|---------|-------------|
| `@rinari/orm` | Core ORM  |
| `@rinari/types` | TypeScript type definitions |

## Contributing

Contributions welcome! We're especially interested in:
- New database drivers (PostgreSQL, MySQL, MongoDB)
- Documentation improvements
- Bug reports and feature requests

[Join our Discord](https://discord.gg/zqxWVH3CvG) to discuss contributions.

## License

OpenUwU Open License (OUOL-1.0) - [View License](https://github.com/OpenUwU/rinari/blob/main/LICENSE)

## Links

- **[Documentation](https://github.com/OpenUwU/rinari/blob/main/docs/README.md)** - Complete guides and API reference
- **[Discord Community](https://discord.gg/zqxWVH3CvG)** - Get help and share projects
- **[GitHub Issues](https://github.com/OpenUwU/rinari/issues)** - Report bugs or request features
- **[OpenUwU Projects](https://github.com/OpenUwU)** - Check out our other tools

---

<p align="center">
  <strong>Built by <a href="https://github.com/OpenUwU">OpenUwU</a></strong><br>
  Also check out <a href="https://github.com/OpenUwU/Yukihana">Yukihana</a> - Discord Music Bot
</p>
