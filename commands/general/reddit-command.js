require(`${require.main.path}/commands/general/reddit.js`)();
module.exports = {
    name: 'reddit',
    aliases: ['sub', 'r', 'submission', 'subreddit'],
    description: 'Shows a random Reddit post from your selected subreddit.',
    //guildOnly: true,
    async execute(message, args) {
        var subreddit = args[0]
        var rType = ''
        redditGetPost(args, message, subreddit, rType)
    }
}