import { Client, GatewayIntentBits, Events } from 'discord.js';
import { ORM } from '@rinari/orm';
import { SQLiteDriver } from '@rinari/sqlite';
import { DataTypes } from '@rinari/types';

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!';

const orm = new ORM({
  driver: new SQLiteDriver({
    storageDir: './data',
  }),
});

const Note = orm.define('default', 'notes', {
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

const Tag = orm.define('default', 'tags', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    notNull: true,
    unique: true,
  },
  usageCount: {
    type: DataTypes.INTEGER,
    notNull: true,
    default: 0,
  },
});

Note.createIndex('idx_user_notes', {
  columns: ['userId', 'createdAt'],
});

Note.createIndex('idx_tags', {
  columns: ['tags'],
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot ready! Logged in as ${client.user?.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  try {
    switch (command) {
      case 'add':
        await handleAddNote(message, args);
        break;
      case 'list':
        await handleListNotes(message, args);
        break;
      case 'search':
        await handleSearchNotes(message, args);
        break;
      case 'tag':
        await handleTagSearch(message, args);
        break;
      case 'delete':
        await handleDeleteNote(message, args);
        break;
      case 'edit':
        await handleEditNote(message, args);
        break;
      case 'stats':
        await handleStats(message);
        break;
      case 'tags':
        await handleListTags(message);
        break;
      case 'help':
        await handleHelp(message);
        break;
    }
  } catch (error) {
    console.error('Command error:', error);
    await message.reply('❌ An error occurred while processing your command.');
  }
});

async function handleAddNote(message, args) {
  const content = args.join(' ');
  const titleMatch = content.match(/"([^"]+)"/);

  if (!titleMatch) {
    await message.reply('❌ Please provide a title in quotes: `!add "Title" content #tag`');
    return;
  }

  const title = titleMatch[1];
  const remainingContent = content.replace(titleMatch[0], '').trim();
  const tags = remainingContent.match(/#\w+/g);
  const noteContent = remainingContent.replace(/#\w+/g, '').trim();

  if (!noteContent) {
    await message.reply('❌ Please provide note content.');
    return;
  }

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

  await message.reply(
    `✅ Note #${note.id} created!\n**${title}**\n${noteContent.substring(0, 100)}${noteContent.length > 100 ? '...' : ''}`
  );
}

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
    await message.reply('📝 You have no notes yet. Use `!add "Title" content` to create one.');
    return;
  }

  const noteList = notes
    .map(
      (note) =>
        `**#${note.id}** - ${note.title}\n${note.content.substring(0, 80)}${note.content.length > 80 ? '...' : ''}\n${note.tags || ''}`
    )
    .join('\n\n');

  await message.reply(
    `📝 Your Notes (Page ${page}/${Math.ceil(total / limit)})\n\n${noteList}\n\n_Total: ${total} notes_`
  );
}

async function handleSearchNotes(message, args) {
  const query = args.join(' ');

  if (!query) {
    await message.reply('❌ Please provide a search query: `!search keyword`');
    return;
  }

  const notes = Note.findAll({
    where: {
      userId: message.author.id,
      title: { $like: `%${query}%` },
    },
    orderBy: [['createdAt', 'DESC']],
  });

  const contentNotes = Note.findAll({
    where: {
      userId: message.author.id,
      content: { $like: `%${query}%` },
    },
    orderBy: [['createdAt', 'DESC']],
  });

  const allNotes = [...notes, ...contentNotes.filter((n) => !notes.find((note) => note.id === n.id))];

  if (allNotes.length === 0) {
    await message.reply(`🔍 No notes found matching "${query}"`);
    return;
  }

  const results = allNotes
    .slice(0, 5)
    .map((note) => `**#${note.id}** - ${note.title}\n${note.content.substring(0, 80)}...`)
    .join('\n\n');

  await message.reply(`🔍 Found ${allNotes.length} notes:\n\n${results}`);
}

async function handleTagSearch(message, args) {
  const tag = args[0]?.startsWith('#') ? args[0] : `#${args[0]}`;

  if (!tag) {
    await message.reply('❌ Please provide a tag: `!tag tagname`');
    return;
  }

  const notes = Note.findAll({
    where: {
      userId: message.author.id,
      tags: { $like: `%${tag}%` },
    },
    orderBy: [['createdAt', 'DESC']],
  });

  if (notes.length === 0) {
    await message.reply(`🏷️ No notes found with tag ${tag}`);
    return;
  }

  const results = notes
    .slice(0, 5)
    .map((note) => `**#${note.id}** - ${note.title}`)
    .join('\n');

  await message.reply(`🏷️ Found ${notes.length} notes with ${tag}:\n\n${results}`);
}

async function handleDeleteNote(message, args) {
  const noteId = parseInt(args[0]);

  if (!noteId) {
    await message.reply('❌ Please provide a note ID: `!delete 1`');
    return;
  }

  const note = Note.findOne({ where: { id: noteId, userId: message.author.id } });

  if (!note) {
    await message.reply('❌ Note not found or you do not own it.');
    return;
  }

  Note.delete({ id: noteId });
  await message.reply(`🗑️ Note #${noteId} deleted.`);
}

async function handleEditNote(message, args) {
  const noteId = parseInt(args[0]);
  const content = args.slice(1).join(' ');

  if (!noteId || !content) {
    await message.reply('❌ Usage: `!edit 1 new content`');
    return;
  }

  const note = Note.findOne({ where: { id: noteId, userId: message.author.id } });

  if (!note) {
    await message.reply('❌ Note not found or you do not own it.');
    return;
  }

  Note.update({ content, updatedAt: new Date().toISOString() }, { id: noteId });
  await message.reply(`✏️ Note #${noteId} updated.`);
}

async function handleStats(message) {
  const total = Note.count({ userId: message.author.id });
  const notes = Note.findAll({ where: { userId: message.author.id } });
  const allTags = notes.flatMap((n) => n.tags?.split(' ') || []);
  const uniqueTags = new Set(allTags.filter((t) => t.startsWith('#')));

  await message.reply(`📊 Your Stats:\n• Total Notes: ${total}\n• Unique Tags: ${uniqueTags.size}`);
}

async function handleListTags(message) {
  const tags = Tag.findAll({
    orderBy: [['usageCount', 'DESC']],
    limit: 10,
  });

  if (tags.length === 0) {
    await message.reply('🏷️ No tags have been used yet.');
    return;
  }

  const tagList = tags.map((tag) => `#${tag.name} (${tag.usageCount})`).join('\n');
  await message.reply(`🏷️ Top Tags:\n\n${tagList}`);
}

async function handleHelp(message) {
  const help = `
📖 **Discord Notes Bot Commands**

\`!add "Title" content #tag\` - Create a new note
\`!list [page]\` - List your notes
\`!search keyword\` - Search notes by title/content
\`!tag tagname\` - Find notes by tag
\`!delete id\` - Delete a note
\`!edit id content\` - Edit a note
\`!stats\` - View your stats
\`!tags\` - List popular tags
\`!help\` - Show this help
`;

  await message.reply(help);
}

client.login(TOKEN);

process.on('SIGINT', () => {
  console.log('Shutting down...');
  orm.disconnect();
  process.exit(0);
});
