module.exports = {
  name: 'random',
  aliases: ['r'],
  description: 'Shows random Reddit posts from your selected subreddit.',
  async execute(message, args) {
    const subreddit = args[0]
    var rType = 'random'
    redditGetPost(args, message, subreddit, rType)
  },
};