module.exports = {
  name: 'boobs',
  aliases: ['boobies', 'bobs', 'tits', 'tit', 'titties', 'boob', 'bob'],
  description: 'Shows random post of r/Boobies.',
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = ['Boobies']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};