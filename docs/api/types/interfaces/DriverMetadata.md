[**@rinari/types**](../README.md)

---

[@rinari/types](../README.md) / DriverMetadata

# Interface: DriverMetadata

Defined in:
[driver.ts:79](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/driver.ts#L79)

Driver metadata and identification.

## Remarks

Provides information about the driver implementation.

## Example

```typescript
console.log(driver.metadata.name); // "sqlite"
console.log(driver.metadata.version); // "1.0.0"
```

## Properties

### name

> **name**: `string`

Defined in:
[driver.ts:84](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/driver.ts#L84)

Driver name identifier.

#### Example

```ts
('sqlite', 'mongodb', 'json');
```

---

### version

> **version**: `string`

Defined in:
[driver.ts:89](https://github.com/OpenUwU/rinari/blob/b47591ce2773ace300eff92cd17a8ffd7bd0c7b7/packages/types/src/driver.ts#L89)

Driver version string.
