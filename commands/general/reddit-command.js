require(`${require.main.path}/commands/general/reddit.js`)();
module.exports = {
    name: 'reddit',
    aliases: ['sub', 'r', 'submission', 'subreddit'],
    description: 'Shows random Reddit posts from your selected subreddit.',
    async execute(message, args) {
        var subreddit = args[0]
        var rType = 'reddit'
        redditGetPost(args, message, subreddit, rType)
    }
}