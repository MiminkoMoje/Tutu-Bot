const { RandomReddit } = require('random-reddit');
const reddittitle = require('random-reddit');
const { redditCredentials } = require(`${require.main.path}/config.json`);

module.exports = {
    name: 'dankmemes',
    aliases: ['dm', 'meme', 'memes', 'dank'],
    description: 'Shows random post of r/dankmemes.',
    guildOnly: false,
    nsfwDisable: false,
    nsfwCommand: false,
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
            "title": reddittitle.title,
            "color": 8340223,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} 💜 | r/dankmemes`,
            },
            "image": {
                "url": post
            },
        };
        message.channel.send({ embed });
    },
};