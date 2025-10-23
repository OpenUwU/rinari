/**
 * @packageDocumentation
 * @module @rinari/types
 *
 * Core TypeScript type definitions for the Rinari ORM framework.
 *
 * @remarks
 * This package provides all shared interfaces, types, and enums used across
 * the Rinari ecosystem. It ensures type consistency between drivers and the core ORM.
 *
 * @example
 * Import types for use in your application:
 * ```typescript
 * import {
 *   TableSchema,
 *   ColumnDefinition,
 *   QueryOptions,
 *   Driver,
 *   DataTypes
 * } from '@rinari/types';
 * ```
 *
 * @public
 */

export * from './orm.js';
export * from './driver.js';
export * from './data-types.js';
