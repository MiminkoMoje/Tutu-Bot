module.exports = {
  name: 'cat',
  aliases: ['kitty', 'pussy', 'kitten', 'meow', ' moew', 'catto', 'cats', 'kittens'],
  description: 'Shows random post of r/cats',
  async execute(message, args) {
    const subreddit = ['cats']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};