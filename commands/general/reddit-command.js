const Discord = require('discord.js');
module.exports = {
  name: 'reddit',
  aliases: ['sub', 'submission', 'subreddit'],
  description: 'Shows the available Reddit commands.',
  async execute(message) {
    var helpEmbed = new Discord.MessageEmbed()
        .setColor(tutuColor)
        .setTitle(`Commands`)
        .setFooter(`Requested by ${message.author.tag} ${tutuEmote} | by Vasilis#1517`, message.author.avatarURL())
        .addFields(
          { name: `random [subreddit]`, value: 'Shows a random submission from a subreddit' },
          { name: `top [subreddit] (hour/day/week/month/year/all)`, value: 'Shows the top posts of a subreddit' },
          { name: `user [a Reddit user]`, value: 'Shows posts of a Reddit user' },
          { name: `id [a Reddit post ID]`, value: 'Gets a post from its ID' },
        )
      message.channel.send({embeds: [helpEmbed]});
  }
}