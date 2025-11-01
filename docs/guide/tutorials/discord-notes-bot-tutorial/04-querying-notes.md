# Part 4: Querying and Listing Notes

Learn how to retrieve notes using Rinari's powerful query system.

## Step 1: List User Notes

```typescript
async function handleListNotes(message, args) {
  const page = parseInt(args[0]) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const notes = Note.findAll({
    where: { userId: message.author.id },
    orderBy: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  const total = Note.count({ userId: message.author.id });

  if (notes.length === 0) {
    await message.reply('You have no notes yet.');
    return;
  }

  const noteList = notes
    .map((note) => `**#${note.id}** - ${note.title}`)
    .join('\n\n');

  await message.reply(
    `Your Notes (Page ${page}/${Math.ceil(total / limit)})\n\n${noteList}`
  );
}
```

## Understanding findAll()

- `where`: Filter records by conditions
- `orderBy`: Sort results (ASC or DESC)
- `limit`: Maximum records to return
- `offset`: Skip records (for pagination)

## Step 2: Search by Title and Content

```typescript
async function handleSearchNotes(message, args) {
  const query = args.join(' ');

  const notes = Note.findAll({
    where: {
      userId: message.author.id,
      title: { $like: `%${query}%` },
    },
    orderBy: [['createdAt', 'DESC']],
  });

  if (notes.length === 0) {
    await message.reply(`No notes found matching "${query}"`);
    return;
  }
}
```

## Using Query Operators

The `$like` operator performs pattern matching:

- `%query%`: Contains query anywhere
- `query%`: Starts with query
- `%query`: Ends with query

## Available Operators

```typescript
{
  age: { $gte: 18, $lt: 65 },     // Greater than/less than
  status: { $in: ['active', 'premium'] },  // In array
  email: { $ne: 'banned@example.com' },    // Not equal
  score: { $between: [0, 100] }    // Between range
}
```

## Step 3: Search by Tags

```typescript
async function handleTagSearch(message, args) {
  const tag = args[0]?.startsWith('#') ? args[0] : `#${args[0]}`;

  const notes = Note.findAll({
    where: {
      userId: message.author.id,
      tags: { $like: `%${tag}%` },
    },
    orderBy: [['createdAt', 'DESC']],
  });
}
```

## Step 4: Count Records

```typescript
async function handleStats(message) {
  const total = Note.count({ userId: message.author.id });
  const notes = Note.findAll({ where: { userId: message.author.id } });

  await message.reply(`Your Stats:\nTotal Notes: ${total}`);
}
```

## Performance Tips

1. **Use indexes** on filtered columns
2. **Limit results** with `limit` option
3. **Select only needed fields** with `select: ['id', 'title']`
4. **Avoid LIKE on large datasets** without indexes

## Testing

```
!list
!list 2
!search roadmap
!tag shopping
!stats
```

## Next Steps

In the next guide, we'll implement updating and deleting notes.
