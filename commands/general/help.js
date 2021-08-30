require(`${require.main.path}/events/embeds.js`)();
const Discord = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['commands', 'command'],
  description: 'Shows the available commands.',
  execute(message) {
      var helpEmbed = new Discord.MessageEmbed()
        .setColor(tutuColor)
        .setTitle(`Commands`)
        .setFooter(`Requested by ${message.author.tag} ${tutuEmote} | by Vasilis#1517`, message.author.avatarURL())
        .addFields(
          { name: `help`, value: 'This command eliminates racism and brings you good luck for 8.2 years' },
          { name: `top [subreddit] (timespan)`, value: 'Shows the top posts of a subreddit\nAvailable timespans are: **hour, day, week, month, year, all**' },
          { name: `user [a Reddit user]`, value: 'Shows posts of a Reddit user' },
          { name: `random [subreddit]`, value: 'Shows a random submission from a subreddit' },
          { name: `id [a Reddit post ID]`, value: 'Gets a post from its ID' },
          { name: `search [subreddit] [query]`, value: 'Conducts a search on the defined subreddit' },
          { name: `asearch`, value: 'Stands for advanced search. Allows you to select the timespan and sorting of the search results. Execute the command for more info' },
          { name: `subreddits`, value: 'Shows the most popular subreddits, based on recent activity' },
          { name: `urban [term]`, value: 'Shows the definition of any term using Urban Dictionary 😳' },
        )
      message.channel.send({embeds: [helpEmbed]});
  },
};