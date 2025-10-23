
# @rinari/types

Core type definitions and enums for the Rinari ORM framework.

[![npm version](https://img.shields.io/npm/v/@rinari/types.svg?style=for-the-badge&)](https://www.npmjs.com/package/@rinari/types)
[![License](https://img.shields.io/badge/license-OUOL--1.0-blue.svg?style=for-the-badge&)](https://github.com/OpenUwU/rinari/blob/main/LICENSE)

## Overview

`@rinari/types` provides the foundational type system for Rinari ORM, including the `DataTypes` enum for schema definition and TypeScript interfaces for type safety across all packages.

## Installation

```bash
npm install @rinari/types
```

This package is typically installed automatically as a dependency of `@rinari/orm` and driver packages.

## Features

- **DataTypes Enum** - Standard data type definitions for all Rinari packages
- **TypeScript Types** - Comprehensive type definitions for full type safety
- **Zero Dependencies** - Lightweight with no external dependencies
- **Cross-Package Compatibility** - Ensures type consistency across the ecosystem

## Usage

### Basic Usage

```javascript
import { DataTypes } from '@rinari/types';

const userSchema = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
  age: { type: DataTypes.INTEGER },
  isActive: { type: DataTypes.BOOLEAN },
  metadata: { type: DataTypes.JSON },
  createdAt: { type: DataTypes.DATETIME },
};
```

### With ORM

```javascript
import { DataTypes } from '@rinari/types';
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';

const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
});
```

## API Reference

### DataTypes Enum

Available data types for column definitions:

| Type | Description | Example |
|------|-------------|---------|
| `DataTypes.TEXT` | Text strings | `'hello world'` |
| `DataTypes.INTEGER` | Integer numbers | `42` |
| `DataTypes.REAL` | Floating point numbers | `3.14` |
| `DataTypes.BLOB` | Binary data | `Buffer.from('data')` |
| `DataTypes.BOOLEAN` | Boolean values | `true` / `false` |
| `DataTypes.DATE` | Date values (ISO format) | `'2024-01-15'` |
| `DataTypes.DATETIME` | Date and time (ISO format) | `'2024-01-15T10:30:00Z'` |
| `DataTypes.JSON` | JSON objects/arrays | `{ key: 'value' }` |

### Column Options

When defining schemas, these options are available:

```javascript
{
  type: DataTypes.TEXT,           // Required: Data type
  primaryKey: true,                // Optional: Primary key flag
  autoIncrement: true,             // Optional: Auto-increment (INTEGER only)
  notNull: true,                   // Optional: NOT NULL constraint
  unique: true,                    // Optional: UNIQUE constraint
  default: 'value',                // Optional: Default value
  references: {                    // Optional: Foreign key
    table: 'other_table',
    column: 'id',
    onDelete: 'CASCADE'
  }
}
```

### Query Operators

Operators for WHERE clauses:

```javascript
// Comparison
{ age: { $gt: 18 } }                    // Greater than
{ age: { $gte: 18 } }                   // Greater than or equal
{ age: { $lt: 65 } }                    // Less than
{ age: { $lte: 65 } }                   // Less than or equal
{ status: { $ne: 'deleted' } }          // Not equal

// Set operations
{ status: { $in: ['active', 'pending'] } }      // In array
{ status: { $notIn: ['deleted', 'banned'] } }   // Not in array

// Pattern matching
{ email: { $like: '%@gmail.com' } }     // Like pattern

// Range
{ age: { $between: [18, 65] } }         // Between range

// Complex conditions
{
  age: { $gte: 18, $lt: 65 },
  status: { $in: ['active', 'verified'] },
  email: { $like: '%@company.com' }
}
```

**Available operators:**

- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$lt` - Less than
- `$lte` - Less than or equal
- `$ne` - Not equal
- `$in` - In array
- `$notIn` - Not in array
- `$like` - Like pattern (SQL LIKE)
- `$between` - Between range (inclusive)

## TypeScript Support

### Automatic Type Inference

TypeScript automatically infers types from your schema:

```typescript
import { DataTypes } from '@rinari/types';
import { ORM } from '@rinari/orm';

const User = orm.define('mydb', 'users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
  age: { type: DataTypes.INTEGER },
});

// TypeScript infers the return type
const user = User.findOne({ where: { id: 1 } });
// user is typed as: { id: number; username: string; email: string; age: number } | null
```

### Advanced Type Imports

For explicit type annotations:

```typescript
import {
  DataTypes,
  TableSchema,
  QueryOptions,
  WhereCondition,
  WhereOperators,
  ColumnDefinition
} from '@rinari/types';

// Explicit schema typing
const schema: TableSchema = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
};

// Type-safe query options
const options: QueryOptions = {
  where: { status: 'active' },
  limit: 10,
  orderBy: [['createdAt', 'DESC']],
};
```

## Examples

### Complete Schema Example

```javascript
import { DataTypes } from '@rinari/types';

const schema = {
  // Primary key with auto-increment
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  // Required text field
  username: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  
  // Optional field with default
  status: {
    type: DataTypes.TEXT,
    default: 'active',
  },
  
  // Integer field
  age: {
    type: DataTypes.INTEGER,
  },
  
  // Boolean field
  isVerified: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  
  // JSON field
  settings: {
    type: DataTypes.JSON,
    default: '{}',
  },
  
  // DateTime field
  createdAt: {
    type: DataTypes.DATETIME,
  },
  
  // Foreign key
  profileId: {
    type: DataTypes.INTEGER,
    references: {
      table: 'profiles',
      column: 'id',
      onDelete: 'CASCADE',
    },
  },
};
```

### Query Examples

```javascript
// Simple equality
User.findAll({ where: { status: 'active' } });

// Comparison operators
User.findAll({ where: { age: { $gte: 18 } } });

// Multiple conditions
User.findAll({
  where: {
    age: { $gte: 18, $lt: 65 },
    status: { $in: ['active', 'verified'] },
  },
});

// Pattern matching
User.findAll({ where: { email: { $like: '%@gmail.com' } } });

// Range queries
User.findAll({ where: { score: { $between: [0, 100] } } });
```

## Related Packages

- **[@rinari/orm](https://github.com/OpenUwU/rinari/tree/main/packages/orm)** - Core ORM functionality
- **[@rinari/sqlite](https://github.com/OpenUwU/rinari/tree/main/packages/sqlite)** - SQLite database driver

## Documentation

- **[API Documentation](https://github.com/OpenUwU/rinari/tree/main/docs/api/types)** - Complete API reference
- **[Type System Guide](https://github.com/OpenUwU/rinari/blob/main/docs/guide/types/overview.md)** - Type system overview
- **[Core Concepts](https://github.com/OpenUwU/rinari/blob/main/docs/guide/core-concepts.md)** - Framework fundamentals
- **[Complete Documentation](https://github.com/OpenUwU/rinari/blob/main/docs/README.md)** - Full documentation hub

## Support

- **[GitHub Issues](https://github.com/OpenUwU/rinari/issues)** - Bug reports and feature requests
- **[Discord Community](https://discord.gg/zqxWVH3CvG)** - Community support and discussions

## License

OpenUwU Open License (OUOL-1.0) - See [LICENSE](https://github.com/OpenUwU/rinari/blob/main/LICENSE) for details.
