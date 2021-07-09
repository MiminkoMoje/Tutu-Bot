require(`${require.main.path}/commands/general/reddit.js`)();
module.exports = {
    name: 'elephant',
    aliases: ['elephants', 'babyelephantgifs'],
    description: 'Shows a random Reddit post from your selected subreddit.',
    //guildOnly: true,
    async execute(message, args) {
        var subreddit = 'babyelephantgifs'
        var rType = 'random-predefined-image'
        redditGetPost(args, message, subreddit, rType)
    }
}