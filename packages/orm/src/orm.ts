import type { Driver, DriverConfig, TableSchema } from '@rinari/types';
import { Model } from './model.js';

/**
 * Configuration options for creating an ORM instance.
 *
 * @remarks
 * The ORM can be configured with a driver, optional connection config,
 * and pre-defined models for immediate use.
 *
 * @example
 * Basic configuration:
 * ```typescript
 * import { ORM } from '@rinari/orm';
 * import { SQLiteDriver } from '@rinari/sqlite';
 *
 * const orm = new ORM({
 *   driver: new SQLiteDriver({ storageDir: './data' })
 * });
 * ```
 *
 * @example
 * With pre-defined models:
 * ```typescript
 * const orm = new ORM({
 *   driver: new SQLiteDriver({ storageDir: './data' }),
 *   models: {
 *     users: {
 *       id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *       username: { type: DataTypes.TEXT, notNull: true, unique: true }
 *     },
 *     posts: {
 *       id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *       title: { type: DataTypes.TEXT, notNull: true }
 *     }
 *   }
 * });
 * ```
 *
 * @public
 */
export interface ORMOptions {
  /**
   * Database driver instance.
   */
  driver: Driver;

  /**
   * Optional driver configuration.
   * If provided, `driver.connect(config)` will be called automatically.
   */
  config?: DriverConfig;

  /**
   * Pre-defined table schemas.
   * All models will be created in the 'default' database.
   */
  models?: string | Record<string, TableSchema>;
}

/**
 * Core ORM class for managing database models and operations.
 *
 * @remarks
 * The ORM provides a high-level API for defining models, managing multiple databases,
 * and executing database operations through a pluggable driver system.
 *
 * @example
 * Complete usage example:
 * ```typescript
 * import { ORM } from '@rinari/orm';
 * import { SQLiteDriver } from '@rinari/sqlite';
 * import { DataTypes } from '@rinari/types';
 *
 * const orm = new ORM({
 *   driver: new SQLiteDriver({ storageDir: './data' })
 * });
 *
 * const User = orm.define('default', 'users', {
 *   id: {
 *     type: DataTypes.INTEGER,
 *     primaryKey: true,
 *     autoIncrement: true
 *   },
 *   username: {
 *     type: DataTypes.TEXT,
 *     notNull: true,
 *     unique: true
 *   },
 *   email: {
 *     type: DataTypes.TEXT,
 *     notNull: true,
 *     unique: true
 *   },
 *   age: {
 *     type: DataTypes.INTEGER
 *   }
 * });
 *
 * const user = User.create({
 *   username: 'alice',
 *   email: 'alice@example.com',
 *   age: 25
 * });
 *
 * const users = User.findAll({ where: { age: { $gte: 18 } } });
 *
 * await orm.disconnect();
 * ```
 *
 * @example
 * Multi-database usage:
 * ```typescript
 * const orm = new ORM({
 *   driver: new SQLiteDriver({ storageDir: './data' })
 * });
 *
 * const User = orm.define('users_db', 'users', schema);
 * const Product = orm.define('products_db', 'products', schema);
 *
 * console.log(orm.getDatabases()); // ['users_db', 'products_db']
 * ```
 *
 * @public
 */
export class ORM {
  private driver: Driver;
  private models: Map<string, Map<string, Model>> = new Map();
  private schemas: Map<string, Map<string, TableSchema>> = new Map();

  /**
   * Creates a new ORM instance.
   *
   * @param options - ORM configuration options
   *
   * @example
   * ```typescript
   * const orm = new ORM({
   *   driver: new SQLiteDriver({ storageDir: './data' }),
   *   models: {
   *     users: {
   *       id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
   *       username: { type: DataTypes.TEXT, notNull: true }
   *     }
   *   }
   * });
   * ```
   */
  constructor(options: ORMOptions) {
    this.driver = options.driver;

    if (options.config) {
      this.driver.connect(options.config);
    }

    if (options.models && typeof options.models === 'object') {
      for (const [tableName, schema] of Object.entries(options.models)) {
        this.define('default', tableName, schema);
      }
    }
  }

  /**
   * Define a new model (table) in the specified database.
   *
   * @param dbName - Database name (use 'default' for single-database setups)
   * @param tableName - Table name
   * @param schema - Table schema definition
   * @returns Model instance for the defined table
   *
   * @remarks
   * If a model with the same name already exists, returns the existing model.
   * The table is automatically created if it doesn't exist.
   *
   * @example
   * ```typescript
   * import { DataTypes } from '@rinari/types';
   *
   * const User = orm.define('default', 'users', {
   *   id: {
   *     type: DataTypes.INTEGER,
   *     primaryKey: true,
   *     autoIncrement: true
   *   },
   *   username: {
   *     type: DataTypes.TEXT,
   *     notNull: true,
   *     unique: true
   *   },
   *   email: {
   *     type: DataTypes.TEXT,
   *     notNull: true
   *   },
   *   created_at: {
   *     type: DataTypes.DATETIME,
   *     default: new Date().toISOString()
   *   }
   * });
   * ```
   */
  define(dbName: string, tableName: string, schema: TableSchema): Model {
    if (!this.models.has(dbName)) {
      this.models.set(dbName, new Map());
      this.schemas.set(dbName, new Map());
    }

    const dbModels = this.models.get(dbName)!;
    const dbSchemas = this.schemas.get(dbName)!;

    if (dbModels.has(tableName)) {
      return dbModels.get(tableName)!;
    }

    const model = new Model(dbName, tableName, schema, this.driver);
    dbModels.set(tableName, model);
    dbSchemas.set(tableName, schema);

    return model;
  }

  /**
   * Retrieve an existing model by database and table name.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @returns Model instance or null if not found
   *
   * @example
   * ```typescript
   * const User = orm.model('default', 'users');
   * if (User) {
   *   const users = User.findAll();
   * }
   * ```
   */
  model(dbName: string, tableName: string): Model | null {
    const dbModels = this.models.get(dbName);
    if (!dbModels) return null;
    return dbModels.get(tableName) || null;
  }

  /**
   * Retrieve a model by table name (defaults to 'default' database).
   *
   * @param tableName - Table name
   * @param dbName - Database name (defaults to 'default')
   * @returns Model instance or null if not found
   *
   * @example
   * ```typescript
   * const User = orm.table('users');
   * const user = User?.findOne({ where: { id: 1 } });
   * ```
   */
  table(tableName: string, dbName: string = 'default'): Model | null {
    return this.model(dbName, tableName);
  }

  /**
   * Check if a model exists.
   *
   * @param dbName - Database name
   * @param tableName - Table name
   * @returns True if model exists, false otherwise
   *
   * @example
   * ```typescript
   * if (!orm.hasModel('default', 'users')) {
   *   orm.define('default', 'users', userSchema);
   * }
   * ```
   */
  hasModel(dbName: string, tableName: string): boolean {
    return this.models.get(dbName)?.has(tableName) ?? false;
  }

  /**
   * Get all schemas for a specific database.
   *
   * @param dbName - Database name
   * @returns Map of table names to schemas, or undefined if database doesn't exist
   *
   * @example
   * ```typescript
   * const schemas = orm.getSchemas('default');
   * if (schemas) {
   *   for (const [tableName, schema] of schemas) {
   *     console.log(`Table: ${tableName}`, schema);
   *   }
   * }
   * ```
   */
  getSchemas(dbName: string): Map<string, TableSchema> | undefined {
    return this.schemas.get(dbName);
  }

  /**
   * Get all models for a specific database.
   *
   * @param dbName - Database name
   * @returns Map of table names to models, or undefined if database doesn't exist
   *
   * @example
   * ```typescript
   * const models = orm.getAllModels('default');
   * if (models) {
   *   for (const [tableName, model] of models) {
   *     console.log(`${tableName}: ${model.count()} records`);
   *   }
   * }
   * ```
   */
  getAllModels(dbName: string): Map<string, Model> | undefined {
    return this.models.get(dbName);
  }

  /**
   * Get names of all databases managed by this ORM instance.
   *
   * @returns Array of database names
   *
   * @example
   * ```typescript
   * const databases = orm.getDatabases();
   * console.log(`Managing ${databases.length} databases:`, databases);
   * ```
   */
  getDatabases(): string[] {
    return Array.from(this.models.keys());
  }

  /**
   * Disconnect from the database and cleanup resources.
   *
   * @remarks
   * Always call this method when you're done using the ORM to prevent
   * resource leaks and ensure proper cleanup.
   *
   * @example
   * ```typescript
   * const orm = new ORM({ driver });
   *
   * try {
   *   // ... use ORM
   * } finally {
   *   await orm.disconnect();
   * }
   * ```
   */
  disconnect(): void | Promise<void> {
    return this.driver.disconnect();
  }

  /**
   * Get driver metadata (name, version).
   *
   * @returns Driver metadata object
   *
   * @example
   * ```typescript
   * const info = orm.driverInfo;
   * console.log(`Using ${info.name} driver v${info.version}`);
   * ```
   */
  get driverInfo() {
    return this.driver.metadata;
  }
}
