const { RandomReddit } = require('random-reddit')
const reddittitle = require('random-reddit')
const { redditCredentials } = require(`${require.main.path}/config.json`);

module.exports = {
  name: 'boobs',
  aliases: ['boobies', 'bobs', 'tits', 'tit', 'titties', 'boob', 'bob'],
  description: 'Shows random post of r/Boobies.',
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

    const post = await reddit.getImage('Boobies')
    message.channel.send(`Tutu well, **${message.author.tag}** 💜\n${post}\n**${reddittitle.title}**`)
  },
};