
# Part 5: Updating and Deleting Notes

Learn how to modify and remove data with Rinari.

## Step 1: Update Note Content

```typescript
async function handleEditNote(message, args) {
  const noteId = parseInt(args[0]);
  const content = args.slice(1).join(' ');

  if (!noteId || !content) {
    await message.reply('Usage: `!edit 1 new content`');
    return;
  }

  const note = Note.findOne({ where: { id: noteId, userId: message.author.id } });

  if (!note) {
    await message.reply('Note not found or you do not own it.');
    return;
  }

  Note.update({ content, updatedAt: new Date().toISOString() }, { id: noteId });

  await message.reply(`Note #${noteId} updated.`);
}
```

## Understanding update()

```typescript
Note.update(
  { field: 'newValue' },  // Data to set
  { id: 1 }               // Where condition
);
```

- Returns number of updated records
- Can update multiple records at once
- Atomic operation

## Step 2: Delete Notes

```typescript
async function handleDeleteNote(message, args) {
  const noteId = parseInt(args[0]);

  if (!noteId) {
    await message.reply('Please provide a note ID: `!delete 1`');
    return;
  }

  const note = Note.findOne({ where: { id: noteId, userId: message.author.id } });

  if (!note) {
    await message.reply('Note not found or you do not own it.');
    return;
  }

  Note.delete({ id: noteId });
  await message.reply(`Note #${noteId} deleted.`);
}
```

## Understanding delete()

```typescript
const deleted = Note.delete({ status: 'inactive' });
```

- Returns number of deleted records
- Can delete multiple records
- Permanent (no soft delete by default)

## Step 3: Bulk Operations

Update multiple notes:

```typescript
Note.bulkUpdate([
  { where: { id: 1 }, data: { status: 'archived' } },
  { where: { id: 2 }, data: { status: 'archived' } },
]);
```

Delete multiple notes:

```typescript
Note.bulkDelete([{ status: 'deleted' }, { age: { $lt: 13 } }]);
```

## Implementing Soft Delete

Add a `deletedAt` column:

```typescript
{
  deletedAt: {
    type: DataTypes.DATETIME,
    default: null,
  }
}
```

Soft delete instead:

```typescript
Note.update({ deletedAt: new Date().toISOString() }, { id: noteId });
```

Filter out deleted notes:

```typescript
Note.findAll({
  where: {
    userId: message.author.id,
    deletedAt: null,
  },
});
```

## Testing

```
!edit 1 Updated content here
!delete 5
```

## Security Note

Always verify ownership before updating or deleting:

```typescript
const note = Note.findOne({ where: { id: noteId, userId: message.author.id } });

if (!note) {
  return; // User doesn't own this note
}
```

## Next Steps

In the final guide, we'll cover advanced features like aggregations and bulk operations.
