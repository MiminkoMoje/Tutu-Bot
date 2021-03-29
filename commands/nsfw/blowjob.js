const { RandomReddit } = require('random-reddit')
const rInfo = require('random-reddit')
const { redditCredentials } = require(`${require.main.path}/config.json`);
require('./nsfw-command.js')();

module.exports = {
  name: 'blowjob',
  aliases: ['bj', 'blowjobs', 'sucking'],
  description: 'Shows random post of r/Blowjob.',
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

    const post = await reddit.getImage('Blowjobs')
    nsfwCommand(message, message.author.tag, post, rInfo.title, rInfo.author, rInfo.subreddit)
  },
};