module.exports = {
  name: 'nsfw',
  aliases: ['porn', 'sex', 'nsfwhardcore', 'the_best_nsfw_gifs', 'nsfw_gifs', 'verticalgifs'],
  description: 'Shows random post of multiple nsfw subreddits.',
  nsfwCommand: true,
  async execute(message, args) {
    const subreddit = [
      'nsfwhardcore',
      'nsfw',
      'The_Best_NSFW_GIFS',
      'nsfw_gifs',
      'VerticalGifs',
      'porn']
    var rType = 'random-predefined-image'
    redditGetPost(args, message, subreddit, rType)
  },
};