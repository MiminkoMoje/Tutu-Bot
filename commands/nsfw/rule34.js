module.exports = {
  name: 'rule34',
  aliases: ['r34', '34'],
  description: 'Shows random post of r/rule34.',
  guildOnly: true,
  nsfwDisable: true,
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = ['rule34']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};