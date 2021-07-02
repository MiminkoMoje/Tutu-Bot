const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'boobs-deprecated',
    aliases: ['boob', 'breasts', 'bobs'],
    description: 'Random boobs image.',
    guildOnly: true,
    nsfwDisable: true,
    nsfwCommand: true,
    async execute(message) {

        const GIF = await neko.nsfw.boobs();
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
    },
};

