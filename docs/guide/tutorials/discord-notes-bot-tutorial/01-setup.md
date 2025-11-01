# Part 1: Setting Up the Discord Notes Bot

This guide will walk you through building a Discord notes bot from scratch using
Rinari ORM.

## Prerequisites

- Node.js 18+ or Bun 1.0+
- A Discord bot token
- Basic TypeScript knowledge

## Step 1: Install Dependencies

Create a new directory and install the required packages:

```bash
npm install @rinari/orm @rinari/sqlite @rinari/types discord.js
npm install -D tsx typescript @types/node
```

## Step 2: Set Up Your Discord Bot

1. Go to the
   [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "Bot" section
4. Click "Add Bot"
5. Copy the bot token and save it securely
6. Enable "Message Content Intent" under Privileged Gateway Intents

## Step 3: Create Environment File

Create a `.env` file:

```
DISCORD_TOKEN=your_bot_token_here
```

## Step 4: Initialize the ORM

Create `index.ts`:

```typescript
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});
```

This sets up Rinari with a SQLite driver that stores data in the `./data`
directory.

## Step 5: Define Your Models

We will create two models: Notes and Tags.

```typescript
interface Note {
  id: number;
  userId: string;
  username: string;
  title: string;
  content: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

const Note = orm.define<Note>('default', 'notes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.TEXT,
    notNull: true,
  },
  username: {
    type: DataTypes.TEXT,
    notNull: true,
  },
  title: {
    type: DataTypes.TEXT,
    notNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    notNull: true,
  },
  tags: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATETIME,
    notNull: true,
  },
  updatedAt: {
    type: DataTypes.DATETIME,
    notNull: true,
  },
});
```

## Step 6: Create Indexes for Performance

Add indexes on frequently queried columns:

```typescript
Note.createIndex('idx_user_notes', {
  columns: ['userId', 'createdAt'],
});

Note.createIndex('idx_tags', {
  columns: ['tags'],
});
```

## Why Indexes Matter

Indexes dramatically improve query performance. The `idx_user_notes` index helps
when listing a user's notes sorted by creation date, while `idx_tags` speeds up
tag searches.

## Next Steps

In the next guide, we'll set up the Discord client and implement our first
command.
