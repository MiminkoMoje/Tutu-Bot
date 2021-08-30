const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const { redditCredentials } = require(`${require.main.path}/config.json`);
require(`${require.main.path}/events/embeds.js`)();

module.exports = {
  name: 'subreddits',
  async execute(message) {

    const r = new snoowrap({
      userAgent: 'TutuBot',
      clientId: redditCredentials.app_id,
      clientSecret: redditCredentials.api_secret,
      username: redditCredentials.username,
      password: redditCredentials.password
    });

    r.getPopularSubreddits({ limit: 5 }).then(async (subreddit) => {
      await subredditEmbed(message, subreddit);
    })

    async function getMore(message, botMessage, subreddit) {
      botMessage.react('⏩')

      const filter = (reaction, user) => {
        return reaction.emoji.name === '⏩' && user.id === message.author.id;
      };

      const collector = botMessage.createReactionCollector({ filter, time: 6000000 });

      collector.on('collect', async (reaction, user) => {
        await subreddit.fetchMore({ amount: 5, append: false }).then(async subreddit => {
          if (subreddit.isFinished === true) {
            var rFinished = new Discord.MessageEmbed()
              .setTitle(`That's all for now!`)
              .setColor(tutuColor)
              .setFooter(`${message.author.tag}`, message.author.avatarURL())
            rFinished.setDescription(`You've reached the end of the popular subreddits listing.`)
            return message.channel.send({ embeds: [rFinished] });
          }
          subredditEmbed(message, subreddit)
        })
        botMessage.reactions.cache.get('⏩').remove()
        collector.stop()
      });

      collector.on('end', collected => {
        botMessage.reactions.cache.get('⏩').remove()
      });
    }

    async function subredditEmbed(message, subreddit) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Popular Subreddits`)
        .setDescription('**The most popular subreddits based on recent activity.**')
        .setFooter(`Requested by ${message.author.tag} ${tutuEmote}`, message.author.avatarURL())
        .setColor(tutuColor)

      subreddit.forEach(async subreddit => {
        if (!subreddit.public_description.length > 0) {
          var subDesc = 'No Description'
        } else {
          var subDesc = subreddit.public_description
        }
        if (subreddit.over18 === true) {
          subreddit.display_name_prefixed = subreddit.display_name_prefixed + ' 🔞'
        }
        embed.addField(subreddit.display_name_prefixed, subDesc)
      })
      var botMessage = await message.channel.send({ embeds: [embed] })
      getMore(message, botMessage, subreddit);
    }
  },
};