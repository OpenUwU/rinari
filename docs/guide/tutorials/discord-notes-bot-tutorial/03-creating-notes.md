
# Part 3: Creating Notes

Let's implement the core feature: creating and storing notes.

## Step 1: Add Command Handler

```typescript
case 'add':
  await handleAddNote(message, args);
  break;
```

## Step 2: Parse Note Input

We'll support this format: `!add "Title" content #tag1 #tag2`

```typescript
async function handleAddNote(message, args) {
  const content = args.join(' ');
  const titleMatch = content.match(/"([^"]+)"/);

  if (!titleMatch) {
    await message.reply('Please provide a title in quotes');
    return;
  }

  const title = titleMatch[1];
  const remainingContent = content.replace(titleMatch[0], '').trim();
  const tags = remainingContent.match(/#\w+/g);
  const noteContent = remainingContent.replace(/#\w+/g, '').trim();

  if (!noteContent) {
    await message.reply('Please provide note content');
    return;
  }
}
```

## Step 3: Create the Note

Use Rinari's `create` method:

```typescript
const now = new Date().toISOString();
const tagString = tags ? tags.join(' ') : null;

const note = Note.create({
  userId: message.author.id,
  username: message.author.username,
  title,
  content: noteContent,
  tags: tagString,
  createdAt: now,
  updatedAt: now,
});
```

## Understanding create()

- Returns the created record with auto-generated ID
- Enforces schema constraints (notNull, unique)
- Atomic operation (all-or-nothing)

## Step 4: Track Tag Usage

We'll use a transaction to ensure tag updates are atomic:

```typescript
if (tags) {
  Tag.transaction(() => {
    for (const tag of tags) {
      const tagName = tag.slice(1);
      const existing = Tag.findOne({ where: { name: tagName } });

      if (existing) {
        Tag.update({ usageCount: existing.usageCount + 1 }, { name: tagName });
      } else {
        Tag.create({ name: tagName, usageCount: 1 });
      }
    }
  });
}
```

## Why Transactions?

Transactions ensure that either all tag updates succeed or none do. If something fails midway, everything rolls back.

## Step 5: Send Confirmation

```typescript
await message.reply(
  `Note #${note.id} created!\n**${title}**\n${noteContent.substring(0, 100)}...`
);
```

## Testing

Try these commands:

```
!add "Grocery List" Buy milk, eggs, bread #shopping
!add "Meeting Notes" Discussed Q4 roadmap #work #meetings
```

## What We Learned

- Using `Note.create()` to insert records
- Implementing transactions with `Tag.transaction()`
- Combining `findOne()` and `update()` for upsert-like behavior

## Next Steps

In the next guide, we'll implement listing and searching notes.
