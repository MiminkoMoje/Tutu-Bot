const fetch = require('node-fetch');
const nekoclient = require('nekos.life');
const neko = new nekoclient();
module.exports = {
    name: 'cat',
    aliases: ['kitty', 'pussy', 'kitten', 'meow', ' moew', 'catto'],
    description: 'Shows a random picture of a cat.',
    async execute(message) {
        if (Math.floor(Math.random() * 2) === 0) {
            var {file} = await fetch('https://aws.random.cat/meow').then(response => response.json());
        } else {
           const meowUrl = await neko.sfw.meow();
           var file = meowUrl.url
        }
        const embed = {
            "color": tutuColor,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} ${tutuEmote}`,
            },
            "image": {
                "url": file
            },
        };
        message.channel.send({ embed });
    },
};