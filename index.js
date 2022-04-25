const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { defPrefix, token, bannedUserID } = require("./config.json");
require(`${require.main.path}/events/embeds.js`)();
require(`${require.main.path}/commands/reddit/reddit.js`)();

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
  if (
    (!message.content.startsWith(guildPrefix) &&
      !message.content.startsWith(`<@${client.user.id}>`)) ||
    message.author.bot
  )
    return;

  let args;
  if (message.content.startsWith(guildPrefix)) {
    args = message.content.slice(guildPrefix.length).trim().split(/ +/);
  } else if (message.content.startsWith(`<@${client.user.id}>`)) {
    args = message.content
      .slice(`<@${client.user.id}>`.length)
      .trim()
      .split(/ +/);
  }
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  try {
    if (bannedUserID.includes(message.author.id)) {
      return errorEmbed(message, "You have been blocked from using Tutu Bot.");
    }

    if (command.disabled) {
      return errorEmbed(message, "This command is disabled.");
    }

    if (message.channel.type === "DM") {
      return errorEmbed(message, "You can't use commands here! Use a server.");
    }

    if (command.nsfwCommand && !message.channel.nsfw) {
      return errorEmbed(
        message,
        "This command can only be used in NSFW channels."
      );
    }

    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return errorEmbed(
          message,
          "You do not have permission to use this command."
        );
      }
    }

    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    return errorEmbed(
      message,
      "An error occured trying to execute that command, please contact Vasilis#1517."
    );
  }
});

client.login(token);
