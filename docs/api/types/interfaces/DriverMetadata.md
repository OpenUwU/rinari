[**@rinari/types**](../README.md)

***

[@rinari/types](../README.md) / DriverMetadata

# Interface: DriverMetadata

Defined in: [driver.ts:79](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L79)

Driver metadata and identification.

## Remarks

Provides information about the driver implementation.

## Example

```typescript
console.log(driver.metadata.name);    // "sqlite"
console.log(driver.metadata.version); // "1.0.0"
```

## Properties

### name

> **name**: `string`

Defined in: [driver.ts:84](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L84)

Driver name identifier.

#### Example

```ts
"sqlite", "mongodb", "json"
```

***

### version

> **version**: `string`

Defined in: [driver.ts:89](https://github.com/OpenUwU/Rinari/blob/64b2f2cffd307b6e9a06908b3bbd0fb795aaaf03/packages/types/src/driver.ts#L89)

Driver version string.
