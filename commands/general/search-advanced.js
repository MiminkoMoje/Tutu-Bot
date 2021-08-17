require(`${require.main.path}/events/embeds.js`)();
module.exports = {
  name: 'asearch',
  aliases: ['as', 'advancedsearch', 'advanced'],
  description: 'Conducts an advanced search.',
  async execute(message, args) {
    if (args[0]) {
      var subreddit = args[0]
    } else {
      const embedTitle = `Advanced Search`
      const embedMsg = `With advanced search, you can select the timespan that posts should be retrieved from, and the sorting option that determines how the results should be sorted.\n\nSyntax: **asearch [subreddit] [timespan] [sort] [query]**.\n\nAvailable timespans are: **hour, day, week, month, year, all**.\nAvailable sorting options are: **relevance, hot, top, new, comments**.\n\nThe normal **search** command searches all posts and sorts them by relevance.`
      return msgEmbed(message, embedTitle, embedMsg)
    }
    
    if (['hour', 'day', 'week', 'month', 'year', 'all'].includes(args[1])) {
      var time = args[1]
    } else {
      const errorMsg = `Please provide a valid timespan.\nAvailable timespans are: **hour, day, week, month, year, all**.\nThis option describes the timespan that posts should be retrieved from.\n\nRemember, the correct syntax is: **asearch [subreddit] [timespan] [sort] [query]**.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    if (['relevance', 'hot', 'top', 'new', 'comments'].includes(args[2])) {
      var sort = args[2]
    } else {
      const errorMsg = `Please provide a valid sorting option.\nAvailable sorting options are: **relevance, hot, top, new, comments**.\nThis option determines how the results should be sorted.\n\nRemember, the correct syntax is: **asearch [subreddit] [timespan] [sort] [query]**.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    if (!args[3]) {
      const errorMsg = `Please provide a search query.\n\nRemember, the correct syntax is: **asearch [subreddit] [timespan] [sort] [query]**.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    delete args[0]
    delete args[1]
    delete args[2]
    var query = args.join(' ').substring(3)
    var rType = 'search'

    redditGetPost(args, message, subreddit, rType, subreddits = 0, time, query, sort)

  },
};