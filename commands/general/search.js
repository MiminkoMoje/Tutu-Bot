require(`${require.main.path}/events/embeds.js`)();
module.exports = {
  name: 'search',
  aliases: ['s', 'find'],
  description: 'Conducts a search.',
  async execute(message, args) {
    if (args[0]) {
      var subreddit = args[0]
    } else {
      const errorMsg = `Please provide a subreddit to conduct the search on.\n\nRemember, the correct syntax is: **search [subreddit] [query]**.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    if (!args[1]) {
      const errorMsg = `Please provide a search query.\n\nRemember, the correct syntax is: **search [subreddit] [query]**.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    delete args[0]
    var query = args.join(' ').substring(1)
    var rType = 'search'

    redditGetPost(args, message, subreddit, rType, subreddits = 0, time = 'all', query, sort = 'relevance')

  },
};