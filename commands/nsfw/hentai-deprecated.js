const nekoclient = require('nekos.life');
const neko = new nekoclient();
module.exports = {
    name: 'hentai-deprecated',
    //aliases: ['femalesolo', 'sologirl', 'solofemale', 'sg'],
    description: 'Random hentai image/GIF.',
    guildOnly: true,
    nsfwDisable: true,
    nsfwCommand: true,
    async execute(message, args) {

        if (args[0] === 'gif') {
            const GIF = await neko.nsfw.randomHentaiGif();
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
            const GIF = await neko.nsfw.hentai();
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
