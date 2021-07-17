module.exports = {
    name: 'top',
    aliases: ['t'],
    description: 'Shows the top Reddit posts from your selected subreddit.',
    async execute(message, args) {
        const subreddit = args[0]
        const time = args[1]
        var rType = 'top'
        redditGetPost(args, message, subreddit, rType, subreddits = 0, time)
    },
};