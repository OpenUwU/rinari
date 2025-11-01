# Discord Notes Bot Example

A feature-rich Discord bot built with Rinari ORM that demonstrates real-world
database integration.

## Features

- **Create notes** with titles, content, and tags
- **List and paginate** through your notes
- **Search notes** by keywords or tags
- **Update and delete** your notes
- **View statistics** and popular tags
- **Multi-user support** with ownership tracking

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Get a Discord bot token:**
   - Visit the
     [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section and create a bot
   - Copy the bot token
   - Enable "Message Content Intent" under Privileged Gateway Intents

3. **Configure your bot:**

   ```bash
   cp .env.example .env
   # Edit .env and add your Discord token
   ```

4. **Run the bot:**

   ```bash
   npm start
   ```

5. **Invite the bot to your server** and try these commands:
   ```
   !help
   !add "My First Note" This is the content #test
   !list
   !search test
   ```

## Complete Tutorial

This example is part of a **comprehensive step-by-step tutorial** that teaches
you:

- Setting up models and indexes
- Discord bot integration
- Advanced queries and search
- Transactions and data consistency
- Aggregations and statistics
- Performance optimization

**[📚 Follow the Complete Tutorial →](../../docs/guide/tutorials/discord-notes-bot-tutorial/README.md)**

The tutorial covers:

1. [Setup & Models](../../docs/guide/tutorials/discord-notes-bot-tutorial/01-setup.md)
2. [Discord Bot Setup](../../docs/guide/tutorials/discord-notes-bot-tutorial/02-discord-setup.md)
3. [Creating Notes](../../docs/guide/tutorials/discord-notes-bot-tutorial/03-creating-notes.md)
4. [Querying & Search](../../docs/guide/tutorials/discord-notes-bot-tutorial/04-querying-notes.md)
5. [Updating & Deleting](../../docs/guide/tutorials/discord-notes-bot-tutorial/05-updating-deleting.md)
6. [Advanced Features](../../docs/guide/tutorials/discord-notes-bot-tutorial/06-advanced-features.md)

## What You'll Learn

- Multi-model relationships (Notes and Tags)
- Database transactions for data consistency
- Advanced queries with operators (`$like`, `$gte`, `$in`)
- Index optimization for performance
- User ownership and permissions
- Search across multiple fields
- Pagination and sorting
- Aggregations (count, sum, statistics)

## Available Commands

- `!help` - Show all commands
- `!add "Title" content #tag` - Create a new note
- `!list [page]` - List your notes (paginated)
- `!search <query>` - Search notes by content
- `!tag <tag>` - Find notes by tag
- `!edit <id> <content>` - Update a note
- `!delete <id>` - Delete a note
- `!stats` - View your note statistics
- `!tags` - See popular tags

## Project Structure

```
index.js          # Main bot file with all commands
.env.example      # Environment variables template
package.json      # Dependencies and scripts
data/             # SQLite database files (created automatically)
```

## Technologies Used

- **[@rinari/orm](https://github.com/OpenUwU/rinari)** - Lightweight ORM
- **[@rinari/sqlite](https://github.com/OpenUwU/rinari/tree/main/packages/sqlite)** -
  SQLite driver
- **[discord.js](https://discord.js.org/)** - Discord bot framework

## Next Steps

After exploring this example:

1. **Extend the bot** - Add categories, sharing, or reminders
2. **Try other examples** - Check out the [Todo List](../02-todo-list) example
3. **Read the docs** - Learn about
   [Common Patterns](../../docs/guide/tutorials/common-patterns.md)
4. **Build your own** - Create a bot with your own features!

## Need Help?

- [Rinari Documentation](../../docs/README.md)
- [Discord Community](https://discord.gg/zqxWVH3CvG)
- [GitHub Issues](https://github.com/OpenUwU/rinari/issues)
