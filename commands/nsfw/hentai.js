module.exports = {
  name: 'hentai',
  aliases: ['hentai_gif'],
  description: 'Shows random post of r/hentai or r/HENTAI_GIF.',
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = ['hentai', 'HENTAI_GIF']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};