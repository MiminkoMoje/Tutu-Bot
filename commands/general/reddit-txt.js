const snoowrap = require('snoowrap');
const { redditCredentials } = require(`${require.main.path}/config.json`);
module.exports = {
    name: 'reddit-txt',
    aliases: ['txt', 'r-txt', 'sub-txt'],
    description: 'Shows a random Reddit post from your selected subreddit.',
    async execute(message, args) {
        const r = new snoowrap({
            userAgent: 'TutuBot',
            clientId: redditCredentials.app_id,
            clientSecret: redditCredentials.api_secret,
            username: redditCredentials.username,
            password: redditCredentials.password
        });

        if (!args[0]) {
            const ErrorMsg = {
                "title": `Error`,
                "description": `Please supply a subreddit.`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `${message.author.tag}`,
                },
            };
            return message.channel.send({ embed: ErrorMsg });
        }

        const text = await r.getRandomSubmission(args[0])
        let subText = text.selftext
        const size = subText.length / 2040;
        for (let i = 0; i < size; i++) {
            const rSubmission = {
                "title": text.title,
                "description": subText.slice(2040 * i, (2040 * i) + 2040),
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `Requested by ${message.author.tag} 💜 | by u/${text.author.name} in ${text.subreddit_name_prefixed}`,
                },
            };
            message.channel.send({ embed: rSubmission });
        }
    },
};

