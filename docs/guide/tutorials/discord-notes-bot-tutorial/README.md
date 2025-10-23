
# Building a Discord Notes Bot with Rinari

A comprehensive tutorial showing how to build a real-world Discord bot using Rinari ORM and JavaScript.

## What You'll Build

A fully-featured Discord bot that allows users to:

- **Create notes** with titles, content, and tags
- **List and paginate** through their notes
- **Search notes** by keywords or tags
- **Update and delete** their notes
- **View statistics** and see popular tags

## Why This Tutorial?

This tutorial demonstrates real-world Rinari usage including:
- Multi-model relationships (Notes and Tags)
- Database transactions for data consistency
- Advanced queries with operators
- Index optimization for performance
- User ownership and permissions
- Search across multiple fields

## Prerequisites

- Node.js 18+ or Bun 1.0+
- Basic JavaScript knowledge
- A Discord bot token ([get one here](https://discord.com/developers/applications))
- Basic familiarity with Discord (helpful but not required)

## Tutorial Structure

Follow these guides in order:

1. **[Setup & Models](./01-setup.md)** - Initialize the project and define database models
2. **[Discord Bot Setup](./02-discord-setup.md)** - Configure the Discord client and message handling
3. **[Creating Notes](./03-creating-notes.md)** - Implement note creation with transactions
4. **[Querying & Search](./04-querying-notes.md)** - Learn advanced queries and search
5. **[Updating & Deleting](./05-updating-deleting.md)** - Modify and remove records safely
6. **[Advanced Features](./06-advanced-features.md)** - Statistics, aggregations, and optimization

## What You Will Learn

### Rinari Concepts

- Defining models with proper schemas
- Creating and managing database indexes
- CRUD operations (Create, Read, Update, Delete)
- Query operators ($like, $gte, $in, etc.)
- Transactions for data consistency
- Aggregations (count, sum, min, max)
- Bulk operations for efficiency
- Performance optimization techniques

### Discord.js Integration

- Setting up a Discord bot
- Handling message events
- Command parsing and routing
- User interaction patterns
- Error handling in bots  

## Complete Example

The full working code is available in `examples/discord-notes-bot/`:

```bash
cd examples/discord-notes-bot
npm install

# Add your Discord token to environment
export DISCORD_TOKEN="your-token-here"

npm start
```

## Key Features Demonstrated

### Database Operations

- Multi-table relationships via foreign keys
- Composite indexes for query optimization
- Atomic transactions for data consistency
- Pagination with limit and offset
- Full-text search across multiple fields

### Query Patterns

```javascript
// Equality matching
Note.findAll({ where: { userId: message.author.id } })

// Pattern matching
Note.findAll({ where: { title: { $like: '%tutorial%' } } })

// Range queries and sorting
Note.findAll({
  where: { createdAt: { $gte: lastWeek } },
  orderBy: [['createdAt', 'DESC']]
})
```

### Real-World Patterns

- User ownership verification
- Timestamp tracking (createdAt, updatedAt)
- Tag usage statistics and analytics
- Search across multiple fields
- Pagination for large result sets
- Graceful error handling

## Architecture

```
Discord Bot Client
       ↓
Message Event Handler
       ↓
Command Router
       ↓
Model Operations (Note, Tag)
       ↓
Rinari ORM
       ↓
SQLite Driver
       ↓
SQLite Database Files
```

## Need Help?

If you get stuck:

1. Check the [Quick Start Tutorial](../quick-start.md)
2. Review the [Core Concepts](../../core-concepts.md) guide
3. Explore the [Common Patterns](../common-patterns.md) guide
4. Ask in the [OpenUwU Discord](https://discord.gg/zqxWVH3CvG)

## Next Steps

After completing this tutorial:

- **Extend the Bot** - Add more commands and features
- **Build Another App** - Try the [Todo List example](https://github.com/OpenUwU/rinari/tree/main/examples/02-todo-list)
- **Learn Advanced Patterns** - Check out [Common Patterns](../common-patterns.md)
- **Contribute** - Share your bot or contribute to Rinari!
