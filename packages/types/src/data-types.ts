/**
 * Standard data types supported across all Rinari drivers.
 *
 * @remarks
 * These data types provide a unified abstraction layer across different database systems.
 * Each driver is responsible for mapping these types to their native equivalents.
 *
 * @example
 * ```typescript
 * import { DataTypes } from '@rinari/types';
 *
 * const userSchema = {
 *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *   name: { type: DataTypes.TEXT, notNull: true },
 *   age: { type: DataTypes.INTEGER },
 *   balance: { type: DataTypes.REAL },
 *   metadata: { type: DataTypes.JSON }
 * };
 * ```
 *
 * @public
 */
export const DataTypes = {
  TEXT: 'TEXT' as const,
  STRING: 'STRING' as const,
  INTEGER: 'INTEGER' as const,
  NUMBER: 'NUMBER' as const,
  REAL: 'REAL' as const,
  BLOB: 'BLOB' as const,
  BOOLEAN: 'BOOLEAN' as const,
  DATE: 'DATE' as const,
  DATETIME: 'DATETIME' as const,
  JSON: 'JSON' as const,
  OBJECT: 'OBJECT' as const,
  ARRAY: 'ARRAY' as const,
} as const;

/**
 * Union type of all valid data type values.
 *
 * @remarks
 * This type is derived from the {@link DataTypes} constant object.
 * Use this type for type-safe data type specifications.
 *
 * @example
 * ```typescript
 * import { DataTypeValue, DataTypes } from '@rinari/types';
 *
 * const myType: DataTypeValue = DataTypes.TEXT; // ✓ Valid
 * const invalidType: DataTypeValue = 'INVALID'; // ✗ Type error
 * ```
 *
 * @public
 */
export type DataTypeValue = (typeof DataTypes)[keyof typeof DataTypes];
