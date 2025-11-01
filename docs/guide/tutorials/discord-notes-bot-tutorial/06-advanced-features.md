# Part 6: Advanced Features

Explore Rinari's powerful advanced features.

## Aggregations

### Count Records

```typescript
const total = Note.count();
const activeNotes = Note.count({ status: 'active' });
```

### Sum Values

```typescript
const totalViews = Note.sum('viewCount');
const userViews = Note.sum('viewCount', { userId: '123' });
```

### Average

```typescript
const avgLength = Note.avg('contentLength');
```

### Min and Max

```typescript
const oldest = Note.min('createdAt');
const newest = Note.max('createdAt');
```

## Bulk Create

Create multiple records efficiently:

```typescript
const notes = Note.bulkCreate([
  {
    userId: '1',
    title: 'Note 1',
    content: 'Content 1',
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: '1',
    title: 'Note 2',
    content: 'Content 2',
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: '1',
    title: 'Note 3',
    content: 'Content 3',
    createdAt: now,
    updatedAt: now,
  },
]);
```

## Complex Queries

### Multiple Conditions

```typescript
Note.findAll({
  where: {
    userId: message.author.id,
    createdAt: { $gte: '2024-01-01' },
    tags: { $like: '%important%' },
  },
});
```

### Field Selection

Only retrieve specific fields:

```typescript
Note.findAll({
  select: ['id', 'title', 'createdAt'],
  where: { userId: message.author.id },
});
```

## Composite Indexes

Create indexes on multiple columns:

```typescript
Note.createIndex('idx_user_tag_date', {
  columns: ['userId', 'tags', 'createdAt'],
});
```

This speeds up queries filtering by user, tags, and date together.

## Partial Indexes

Create indexes with conditions:

```typescript
Note.createIndex('idx_active_notes', {
  columns: ['createdAt'],
  where: 'deletedAt IS NULL',
});
```

Only indexes non-deleted notes, saving space and improving performance.

## Transaction Best Practices

### Simple Transaction

```typescript
const result = Note.transaction(() => {
  const note = Note.create(data);
  Tag.update({ usageCount: count + 1 }, { name: 'important' });
  return note;
});
```

### Error Handling

```typescript
try {
  Note.transaction(() => {
    Note.create(data);
    throw new Error('Something went wrong');
  });
} catch (error) {
  console.log('Transaction rolled back');
}
```

## Multi-Database Support

Use multiple databases:

```typescript
const orm = new ORM({
  driver: new SQLiteDriver({ storageDir: './data' }),
});

const User = orm.define('users_db', 'users', userSchema);
const Analytics = orm.define('analytics_db', 'events', eventSchema);
```

Creates separate database files:

- `./data/users_db.sqlite`
- `./data/analytics_db.sqlite`

## Implementing Popular Tags

```typescript
async function handleListTags(message) {
  const tags = Tag.findAll({
    orderBy: [['usageCount', 'DESC']],
    limit: 10,
  });

  const tagList = tags
    .map((tag) => `#${tag.name} (${tag.usageCount})`)
    .join('\n');
  await message.reply(`Top Tags:\n\n${tagList}`);
}
```

## Performance Monitoring

Track query performance:

```typescript
const start = Date.now();
const notes = Note.findAll({ where: { userId: id } });
console.log(`Query took ${Date.now() - start}ms`);
```

## Best Practices Checklist

- Use indexes on frequently queried columns
- Use bulk operations for multiple records
- Wrap related operations in transactions
- Validate data before creating records
- Implement proper error handling
- Close database connections on shutdown
- Use TypeScript interfaces for type safety

## Deployment

When deploying:

1. Set up your environment variables securely
2. Configure the run command to start your bot
3. Use a platform like Replit for easy deployment

## Next Steps

You now have a fully functional Discord notes bot! Consider adding:

- Note sharing between users
- Categories or folders
- Search by date ranges
- Export notes to JSON
- Note attachments or images
- Reminders and notifications
