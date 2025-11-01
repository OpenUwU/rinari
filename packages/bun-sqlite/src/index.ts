/**
 * @packageDocumentation
 * @module @rinari/bun-sqlite
 *
 * High-performance Bun-native SQLite driver for @rinari/orm.
 *
 * @remarks
 * Built on Bun's native `bun:sqlite` module with support for multiple database files,
 * ACID transactions, advanced query operations, and comprehensive index management.
 *
 * **Performance:** 3-6x faster than better-sqlite3 for read queries, 8-9x faster than deno.land/x/sqlite.
 *
 * **Requirements:** This driver requires the Bun runtime (>=1.0.0). It will not work with Node.js.
 * Use `@rinari/sqlite` for Node.js compatibility.
 *
 * Key features:
 * - Synchronous and extremely fast (built on Bun's native SQLite)
 * - Multi-database support (manage multiple SQLite files)
 * - ACID transactions with automatic rollback
 * - Advanced query operators ($gt, $lt, $in, $like, $between, etc.)
 * - Index creation and management
 * - WAL mode for better performance
 * - Comprehensive aggregation support
 *
 * @example
 * Basic usage:
 * ```typescript
 * import { BunSQLiteDriver } from '@rinari/bun-sqlite';
 * import { ORM } from '@rinari/orm';
 * import { DataTypes } from '@rinari/types';
 *
 * const driver = new BunSQLiteDriver({
 *   storageDir: './data'
 * });
 *
 * const orm = new ORM({ driver });
 *
 * const User = orm.define('default', 'users', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *   username: { type: DataTypes.TEXT, notNull: true, unique: true },
 *   email: { type: DataTypes.TEXT, notNull: true }
 * });
 *
 * const user = User.create({
 *   username: 'alice',
 *   email: 'alice@example.com'
 * });
 * ```
 *
 * @public
 */

export { BunSQLiteDriver } from './driver.js';
export { Connection } from './connection.js';
export type { ConnectionOptions } from './connection.js';
export { QueryBuilder } from './query-builder.js';
export { SchemaManager } from './schema.js';
