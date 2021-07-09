module.exports = {
  name: 'nsfw',
  aliases: ['porn', 'sex'],
  description: 'Shows random post of multiple nsfw subreddits.',
  guildOnly: true,
  nsfwDisable: true,
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = [
      'nsfwhardcore',
      'nsfw',
      //'NSFW_GIF',
      'The_Best_NSFW_GIFS',
      'nsfw_gifs',
      'VerticalGifs',
      'porn']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};