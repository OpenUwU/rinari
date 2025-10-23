# Types Package Overview

The `@rinari/types` package provides all TypeScript type definitions for the
Rinari framework.

## Why a Separate Types Package?

The types package is separated to:

- Ensure consistency across all Rinari packages
- Allow type-only imports for better tree-shaking
- Provide a single source of truth for type definitions
- Enable custom driver development

## Key Type Categories

### 1. Data Types

```typescript
import { DataTypes } from '@rinari/types';

DataTypes.INTEGER; // Integer numbers
DataTypes.TEXT; // Text strings
DataTypes.REAL; // Floating point
DataTypes.BOOLEAN; // Boolean values
DataTypes.DATE; // Date values
DataTypes.DATETIME; // Date and time
DataTypes.JSON; // JSON objects
DataTypes.BLOB; // Binary data
```

### 2. Schema Types

```typescript
import type { TableSchema, ColumnDefinition } from '@rinari/types';

const userSchema: TableSchema = {
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
};
```

### 3. Query Types

```typescript
import type { QueryOptions, WhereOperators } from '@rinari/types';

const options: QueryOptions = {
  where: {
    age: { $gte: 18, $lt: 65 },
    status: 'active',
  },
  orderBy: [['createdAt', 'DESC']],
  limit: 10,
};
```

### 4. Driver Interfaces

```typescript
import type { Driver, SyncDriver, AsyncDriver } from '@rinari/types';

class MyDriver implements SyncDriver {
  // Implement driver methods
}
```

## Type Definitions Reference

### ColumnDefinition

```typescript
interface ColumnDefinition {
  type: DataType;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
  unique?: boolean;
  default?: any;
  references?: {
    table: string;
    column: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  };
}
```

### QueryOptions

```typescript
interface QueryOptions {
  where?: Record<string, any>;
  orderBy?: Array<[string, 'ASC' | 'DESC']>;
  limit?: number;
  offset?: number;
  select?: string[];
}
```

### WhereOperators

```typescript
interface WhereOperators {
  $gt?: WhereValue;
  $gte?: WhereValue;
  $lt?: WhereValue;
  $lte?: WhereValue;
  $ne?: WhereValue;
  $in?: WhereValue[];
  $notIn?: WhereValue[];
  $like?: string;
  $between?: [WhereValue, WhereValue];
}
```

### Driver Interfaces

```typescript
interface Driver {
  readonly metadata: DriverMetadata;
  connect(config: DriverConfig): Promise<void> | void;
  disconnect(): Promise<void> | void;
  createTable(
    dbName: string,
    tableName: string,
    schema: TableSchema
  ): Promise<void> | void;
  findOne<T>(
    dbName: string,
    tableName: string,
    options: QueryOptions
  ): Promise<T | null> | T | null;
  findAll<T>(
    dbName: string,
    tableName: string,
    options: QueryOptions
  ): Promise<T[]> | T[];
  // ... more methods
}
```

## Usage Examples

### Basic Schema

```typescript
import { DataTypes, type TableSchema } from '@rinari/types';

const userSchema: TableSchema = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.TEXT, notNull: true },
  email: { type: DataTypes.TEXT, unique: true },
};
```

### Complex Query

```typescript
import type { QueryOptions } from '@rinari/types';

const queryOptions: QueryOptions = {
  where: {
    age: { $gte: 18, $lt: 65 },
    status: { $in: ['active', 'premium'] },
  },
  orderBy: [['createdAt', 'DESC']],
  limit: 20,
  select: ['id', 'username', 'email'],
};
```

### Custom Driver

```typescript
import type { SyncDriver, DriverConfig, TableSchema } from '@rinari/types';

class CustomDriver implements SyncDriver {
  readonly metadata = {
    name: 'custom',
    version: '1.0.0',
  };

  connect(config: DriverConfig): void {
    // Implementation
  }

  // Implement all required methods...
}
```

## Type Safety Benefits

### Compile-Time Checking

```typescript
import type { TableSchema } from '@rinari/types';

const schema: TableSchema = {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: 'INVALID' }, // ✗ Type error!
};
```

### IntelliSense Support

```typescript
const options: QueryOptions = {
  where: {
    age: {
      $g, // IntelliSense suggests: $gt, $gte
    },
  },
};
```

### Generic Type Parameters

```typescript
interface User {
  id: number;
  username: string;
}

const users: User[] = driver.findAll<User>('default', 'users', {});
```

## Best Practices

1. **Use Type Imports**: Import types with `type` keyword

   ```typescript
   import type { TableSchema } from '@rinari/types';
   ```

2. **Define Interfaces**: Create interfaces for your models

   ```typescript
   interface User {
     id: number;
     username: string;
     email: string;
   }
   ```

3. **Leverage Generics**: Use generic type parameters

   ```typescript
   const User = orm.define<User>('default', 'users', schema);
   ```

4. **Type Guards**: Add runtime type checking
   ```typescript
   function isUser(obj: any): obj is User {
     return typeof obj.id === 'number' && typeof obj.username === 'string';
   }
   ```

## Next Steps

- [Models Guide](../orm/models.md)
- [Core Concepts](../core-concepts.md)
- [API Documentation](../../api/README.md)
