const nekoclient = require('nekos.life');
const neko = new nekoclient();
module.exports = {
    name: 'blowjob-deprecated',
  //  aliases: ['bj', 'sucking'],
    description: 'Random blowjob image.',
    guildOnly: true,
    nsfwDisable: true,
    nsfwCommand: true,

    async execute(message) {
        const GIF = await neko.nsfw.bJ();
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

