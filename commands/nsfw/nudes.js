const { RandomReddit } = require('random-reddit')
const rInfo = require('random-reddit')
const { redditCredentials } = require(`${require.main.path}/config.json`);
require('./nsfw-command.js')();

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
            "title": rInfo.title,
            "color": 8340223,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} 💜 | Tutu well! | by ${rInfo.author} in ${rInfo.subreddit}`,
            },
            "image": {
                "url": post
            },
        };
        message.channel.send({ embed });
    },
};