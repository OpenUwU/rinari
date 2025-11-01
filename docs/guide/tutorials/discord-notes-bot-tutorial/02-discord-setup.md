# Part 2: Setting Up the Discord Client

Now that we have our database models ready, let's connect to Discord.

## Step 1: Initialize Discord Client

```typescript
import { Client, GatewayIntentBits, Events } from 'discord.js';

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
```

## Understanding Intents

- `Guilds`: Access to guild (server) information
- `GuildMessages`: Receive message events
- `MessageContent`: Read message content (requires privileged intent)

## Step 2: Handle Bot Ready Event

```typescript
client.once(Events.ClientReady, () => {
  console.log(`Bot ready! Logged in as ${client.user?.tag}`);
});
```

This event fires once when the bot successfully connects to Discord.

## Step 3: Set Up Message Handler

```typescript
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  try {
    switch (command) {
      case 'help':
        await handleHelp(message);
        break;
    }
  } catch (error) {
    console.error('Command error:', error);
    await message.reply('An error occurred.');
  }
});
```

## Step 4: Implement Help Command

```typescript
async function handleHelp(message) {
  const help = `
**Discord Notes Bot Commands**

\`!add "Title" content #tag\` - Create a note
\`!list\` - List your notes
\`!help\` - Show this help
`;

  await message.reply(help);
}
```

## Step 5: Login the Bot

```typescript
client.login(TOKEN);
```

## Step 6: Handle Graceful Shutdown

```typescript
process.on('SIGINT', () => {
  console.log('Shutting down...');
  orm.disconnect();
  process.exit(0);
});
```

This ensures the database connection is properly closed when the bot stops.

## Testing

Run your bot:

```bash
npm start
```

Test the `!help` command in Discord. You should see the help message appear.

## Next Steps

In the next guide, we'll implement note creation using Rinari's create
operations.
