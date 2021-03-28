const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'girlsolo',
    description: 'Random solo girl image/GIF.',
    guildOnly: true,
    nsfwDisable: true,
    nsfwCommand: true,
    async execute(message, args) {

        if (args[0] === 'gif') {
            const GIF = await neko.nsfw.girlSoloGif();
            const embed = {
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `Requested by ${message.author.tag} 💜 | Tutu well!`,
                },
                "image": {
                    "url": GIF.url
                },
            };
            message.channel.send({ embed });
        } else {
            const GIF = await neko.nsfw.girlSolo();
            const embed2 = {
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `Requested by ${message.author.tag} 💜 | Tutu well!`,
                },
                "image": {
                    "url": GIF.url
                },
            };
            message.channel.send({ embed: embed2 });
        }
    },
};
