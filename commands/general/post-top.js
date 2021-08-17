module.exports = {
  name: 'top',
  aliases: ['t'],
  description: 'Shows the top Reddit posts from your selected subreddit.',
  async execute(message, args) {

    if (!args[0]) {
      const errorMsg = `Please provide a subreddit.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    } else {
      var subreddit = args[0]
    }

    if (!args[1]) {
      var time = 'day'
    } else {
      if (['hour', 'day', 'week', 'month', 'year', 'all'].includes(args[1])) {
        var time = args[1]
      } else {
        const errorMsg = `Please provide a valid timespan.\nAvailable timespans are: **hour, day, week, month, year, all**.\nThis option describes the timespan that posts should be retrieved from.`
        return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
      }
    }
    var rType = 'top'
    redditGetPost(args, message, subreddit, rType, subreddits = 0, time)
  },
};