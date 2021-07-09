module.exports = {
  name: 'boobs',
  aliases: ['boobies', 'bobs', 'tits', 'tit', 'titties', 'boob', 'bob'],
  description: 'Shows random post of r/Boobies.',
  guildOnly: true,
  nsfwDisable: true,
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = ['Boobies']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};