const { RandomReddit } = require('random-reddit')
const reddittitle = require('random-reddit')
const { redditCredentials } = require(`${require.main.path}/config.json`);

module.exports = {
  name: 'realgirls',
  aliases: ['rg'],
  description: 'Shows random post of r/RealGirls.',
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

    const post = await reddit.getImage('RealGirls')
    message.channel.send(`Tutu well, **${message.author.tag}** 💜\n${post}\n**${reddittitle.title}**`)
  },
};

