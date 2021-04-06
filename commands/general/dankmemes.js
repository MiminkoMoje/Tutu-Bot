const { RandomReddit } = require('random-reddit');
const rInfo = require('random-reddit');
const { redditCredentials } = require(`${require.main.path}/config.json`);

module.exports = {
    name: 'dankmemes',
    aliases: ['dm', 'meme', 'memes', 'dank'],
    description: 'Shows random post of r/dankmemes.',
    async execute(message) {
        const reddit = new RandomReddit({
            username: redditCredentials.username,
            password: redditCredentials.password,
            app_id: redditCredentials.app_id,
            api_secret: redditCredentials.api_secret,
            logs: false
        });

        const post = await reddit.getImage('dankmemes')
        const embed = {
            "title": rInfo.title,
            "color": tutuColor,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} 💜 | by ${rInfo.author} in ${rInfo.subreddit}`,
            },
            "image": {
                "url": post
            },
        };
        message.channel.send({ embed });
    },
};