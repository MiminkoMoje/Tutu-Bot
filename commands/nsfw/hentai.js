module.exports = {
  name: 'hentai',
  description: 'Shows random post of r/hentai or r/HENTAI_GIF.',
  guildOnly: true,
  nsfwDisable: true,
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = ['hentai', 'HENTAI_GIF']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};