const { RandomReddit } = require('random-reddit')
const reddittitle = require('random-reddit')
const { redditCredentials } = require(`${require.main.path}/config.json`);

module.exports = {
  name: 'nsfw',
  aliases: ['porn', 'sex'],
  description: 'Shows random post of multiple nsfw subreddits.',
  guildOnly: true,
  nsfwDisable: true,
  nsfwCommand: true,
  async execute(message) {
    const reddit = new RandomReddit({
      username: redditCredentials.username,
      password: redditCredentials.password,
      app_id: redditCredentials.app_id,
      api_secret: redditCredentials.api_secret,
      logs: false
    });

    var subreddit_nsfw = [
        'nsfwhardcore',
        'nsfw',
        'NSFW_GIF',
        'The_Best_NSFW_GIFS',
        'nsfw_gifs',
        'gifsgonewild',
        'VerticalGifs',
        'porn'
    ]
    
    const post = await reddit.getImage(subreddit_nsfw)
    message.channel.send(`Tutu well, **${message.author.tag}** 💜\n${post}\n**${reddittitle.title}**`)
  },
};