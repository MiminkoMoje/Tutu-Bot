const { RandomReddit } = require('random-reddit')
const rInfo = require('random-reddit')
const { redditCredentials } = require(`${require.main.path}/config.json`);
require('./nsfw-command.js')();

module.exports = {
    name: 'nudes',
    aliases: ['nude', 'realgirls', 'legalteens', 'collegesluts'],
    description: 'Shows random post of r/Nude_Selfie, r/RealGirls, r/LegalTeens or r/collegesluts.',
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

        var subreddits = [
            'Nude_Selfie',
            'RealGirls',
            'LegalTeens',
            'collegesluts'
        ]

        const post = await reddit.getImage(subreddits)
        nsfwCommand(message, message.author.tag, post, rInfo.title, rInfo.author, rInfo.subreddit)
    },
};