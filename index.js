const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { defPrefix, token, ownerId, bannedUserID } = require("./config.json");
require(`${require.main.path}/events/embeds.js`)();
require(`${require.main.path}/commands/general/reddit.js`)();

const prefix = require("discord-prefix");
const defaultPrefix = defPrefix;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["CHANNEL"],
});
client.commands = new Collection();

//require(`${require.main.path}/commands/redditEvent/loadEvents.js`)(client);

const commandFolders = fs.readdirSync("./commands");
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
  client.user.setActivity(`for ${defPrefix}help`, { type: "WATCHING" });
  global.tutuColor = 7799039;
  global.errorColor = 16724787;
  global.tutuEmote = "💜";
});

client.on("messageCreate", (message) => {
  let guildPrefix;
  if (message.channel.type === "DM") {
    guildPrefix = defaultPrefix;
  } else {
    guildPrefix = prefix.getPrefix(message.guild.id);
  }
  if (!guildPrefix) guildPrefix = defaultPrefix;
  if (!message.content.startsWith(guildPrefix) || message.author.bot) return;

  const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  try {
    if (bannedUserID.includes(message.author.id)) {
      const errorMsg = `You have been blocked from using Tutu Bot.`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }

    if (command.disabled) {
      const errorMsg = `This command is disabled.`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }

    if (message.channel.type === "DM") {
      const errorMsg = `You can't use commands here! Use a server.`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }

    if (command.nsfwCommand && !message.channel.nsfw) {
      const errorMsg = `This command can only be used in NSFW channels.`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }

    if (command.permissions) {
      if (message.channel.type === "DM") {
        return errorGuildOnly(
          message,
          message.author.avatarURL(),
          message.author.tag
        );
      } else {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
          const errorMsg = `You do not have permission to use this command.`;
          return errorEmbed(
            message,
            errorMsg,
            message.author.avatarURL(),
            message.author.tag
          );
        }
      }
    }

    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    const errorMsg = `An error occured trying to execute that command, please contact Vasilis#1517.`;
    return errorEmbed(
      message,
      errorMsg,
      message.author.avatarURL(),
      message.author.tag
    );
  }
});

client.login(token);
