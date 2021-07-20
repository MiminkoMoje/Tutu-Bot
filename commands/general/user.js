module.exports = {
  name: 'user',
  aliases: ['u', 'redditor'],
  description: 'Shows posts of a user.',
  async execute(message, args) {
    const subreddit = args[0]
    var rType = 'user'
    redditGetPost(args, message, subreddit, rType)
  },
};