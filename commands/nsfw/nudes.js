const { RandomReddit } = require('random-reddit')
const reddittitle = require('random-reddit')
const { redditCredentials } = require(`${require.main.path}/config.json`);

module.exports = {
    name: 'nudes',
    aliases: ['nude'],
    description: 'Shows random post of r/Nude_Selfie.',
    guildOnly: true,
    nsfwDisable: true,
    nsfwCommand: true,
    async execute(message) {
        const reddit = new RandomReddit({
            username: redditCredentials.username,
            password: redditCredentials.password,
            app_id: redditCredentials.app_id,
            api_secret: redditCredentials.api_secret,
            logs: false
          });

        const post = await reddit.getImage('Nude_Selfie')
        const embed = {
            "title": reddittitle.title,
            "color": 8340223,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} 💜 | Tutu well! | r/Nude_Selfie`,
            },
            "image": {
                "url": post
            },
        };
        message.channel.send({ embed });
    },
};