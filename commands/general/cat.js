const fetch = require('node-fetch');

module.exports = {
    name: 'cat',
    aliases: ['kitty', 'pussy', 'kitten', 'meow'],
    description: 'Shows a random picture of a cat.',
    async execute(message) {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        const embed = {
            "color": 8340223,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} 💜 | meow`,
            },
            "image": {
                "url": file
            },
        };
        message.channel.send({ embed });
    },
};