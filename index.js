const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, ownerId, nsfwDisableGuildID, bannedUserID } = require('./config.json');
require(`${require.main.path}/events/embeds.js`)();

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
require('discord-buttons')(client);
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
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

client.once('ready', () => {
    console.log(`Logged in as ${client.user.username}!`)
    client.user.setActivity(`for ${prefix}help`, { type: 'WATCHING' })
    global.tutuColor = 7799039
    global.errorColor = 16724787
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        if (bannedUserID.includes(message.author.id)) {
            const errorMsg = `You have been blocked from using Tutu Bot.`
            return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
        }

        if (command.disabled) {
            const errorMsg = `This command is disabled.`
            return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
        }

        if (command.guildOnly && message.channel.type === 'dm') {
            return errorGuildOnly(message, message.author.avatarURL(), message.author.tag)
        }

        if (command.nsfwDisable && nsfwDisableGuildID.includes(message.guild.id)) {
            return errorNsfwDisabled(message, message.author.avatarURL(), message.author.tag)
        }

        if (command.nsfwCommand && !message.channel.nsfw) {
            const errorMsg = `This command can only be used in NSFW channels.`
            return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
        }

        if (command.permissions) {
            if (message.channel.type === 'dm') {
                return errorGuildOnly(message, message.author.avatarURL(), message.author.tag)
            } else {
                const authorPerms = message.channel.permissionsFor(message.author);
                if (!authorPerms || !authorPerms.has(command.permissions)) {
                    const errorMsg = `You do not have permission to use this command.`
                    return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
                }
            }
        }

        command.execute(message, args, client);

    } catch (error) {
        console.error(error);
        const errorMsg = `An error occured trying to execute that command, please contact Vasilis#1517.`
        return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

});

client.login(token);