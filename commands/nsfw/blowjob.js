module.exports = {
  name: 'blowjob',
  aliases: ['bj', 'blowjobs', 'sucking'],
  description: 'Shows random post of r/Blowjobs.',
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = ['Blowjobs']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  }
};