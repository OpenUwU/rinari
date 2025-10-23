/**
 * @packageDocumentation
 * @module @rinari/orm
 *
 * Lightweight, pluggable ORM for Node.js and Bun with support for multiple database drivers.
 *
 * @remarks
 * The Rinari ORM provides a simple, type-safe API for database operations.
 * It supports both synchronous and asynchronous drivers, making it compatible
 * with SQLite, MongoDB, JSON files, and custom database backends.
 *
 * Key features:
 * - Pluggable driver architecture
 * - Zero dependencies (core package)
 * - Multi-database support
 * - Full TypeScript support with generics
 * - Both sync and async operations
 * - Transaction support
 * - Advanced query operators
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { ORM } from '@rinari/orm';
 * import { SQLiteDriver } from '@rinari/sqlite';
 * import { DataTypes } from '@rinari/types';
 *
 * const orm = new ORM({
 *   driver: new SQLiteDriver({ storageDir: './data' })
 * });
 *
 * interface User {
 *   id: number;
 *   username: string;
 *   email: string;
 * }
 *
 * const User = orm.define<User>('default', 'users', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *   username: { type: DataTypes.TEXT, notNull: true, unique: true },
 *   email: { type: DataTypes.TEXT, notNull: true, unique: true }
 * });
 *
 * const user = User.create({
 *   username: 'alice',
 *   email: 'alice@example.com'
 * });
 *
 * const users = User.findAll({
 *   where: { username: { $like: '%alice%' } }
 * });
 * ```
 *
 * @public
 */

export { ORM } from './orm.js';
export { Model } from './model.js';
export type { ORMOptions } from './orm.js';
