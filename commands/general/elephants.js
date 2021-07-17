require(`${require.main.path}/commands/general/reddit.js`)();
module.exports = {
  name: 'elephant',
  aliases: ['elephants', 'babyelephantgifs'],
  description: 'Shows random post of r/babyelephantgifs.',
  async execute(message, args) {
    var subreddit = ['babyelephantgifs']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  }
}