module.exports = {
  name: 'threesome',
  aliases: ['xsome', 'xsomes', 'threesomes', 'foursome', 'foursomes', 'groupsex', 'fivesome', 'fivesomes'],
  description: 'Shows random post of r/Xsome, r/Threesome or r/groupsex.',
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = [
      'Xsome',
      'Threesome',
      'groupsex']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};

