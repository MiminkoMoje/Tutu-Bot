const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, ownerId } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');

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
    client.user.setActivity('you fail at life | ,help', { type: 'WATCHING' })
    global.nsfwErrorMsg = {
        "title": `Error`,
        "description": `The NSFW commands are disabled for this server. Please contact <@${ownerId}> if you want them enabled.`,
        "color": 8340223,
    };
    global.nsfwDisableID = [ //Add guild IDs to disable the bot for
        '614631355694710795',
        //'436952826380288010'
    ]
    global.bannedID = [ //Add user IDs to "ban" them from using the bot
        '456431947183554560'
    ]
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        if (bannedID.includes(message.author.id)) {
            const bannedErrorMsg = {
                "title": `Error`,
                "description": `You have been banned from using this bot.`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `${message.author.tag}`,
                },
            };
            return message.channel.send({ embed: bannedErrorMsg });
        }

        if (command.disabled) {
            const disabledErrorMsg = {
                "title": `Error`,
                "description": `This command is disabled.`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `${message.author.tag}`,
                },
            };
            return message.channel.send({ embed: disabledErrorMsg });
        }

        if (command.guildOnly && message.channel.type === 'dm') {
            const DMErrorMsg = {
                "title": `Error`,
                "description": `You can't use this command in DMs.`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `${message.author.tag}`,
                },
            };
            return message.channel.send({ embed: DMErrorMsg });
        }

        if (command.nsfwDisable && nsfwDisableID.includes(message.guild.id)) {
            return message.channel.send({ embed: nsfwErrorMsg })
        }

        if (command.nsfwCommand && !message.channel.nsfw) {
            const nsfwOnlyErrorMsg = {
                "title": `Error`,
                "description": `This command can only be used in NSFW channels.`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `${message.author.tag}`,
                },
            };
            return message.channel.send({ embed: nsfwOnlyErrorMsg });
        }

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                const PermErrorMsg = {
                    "title": `Error`,
                    "description": `You do not have permission to use this command.`,
                    "color": 8340223,
                    "footer": {
                        "icon_url": message.author.avatarURL(),
                        "text": `${message.author.tag}`,
                    },
                };
                return message.channel.send({ embed: PermErrorMsg });
            }
        }


        command.execute(message, args);
    } catch (error) {
        console.error(error);
        const FatalErrorMsg = {
            "title": `Error`,
            "description": `An error occured trying to execute that command! Please contact <@${ownerId}>.`,
            "color": 8340223,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `${message.author.tag}`,
            },
        };
        return message.channel.send({ embed: FatalErrorMsg });
    }

});

client.login(token);