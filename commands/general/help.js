const { nsfwDisableGuildID } = require(`${require.main.path}/config.json`);
require(`${require.main.path}/events/embeds.js`)();
const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows the available commands.',
  execute(message, args) {

    if (args[0] === 'nsfw') {
      var nsfwEmbed = new Discord.MessageEmbed()
        .setColor(tutuColor)
        .setTitle(`NSFW Commands`)
        .setDescription(`Mmmmmmmm 🤤 I see that you need something to satisfy your.... needs........😏 ahaaaaaaa.... now... what command will you........ choose, yk what I'm sayin'? 😏 Mmmmmmmmmmm.... go ahead..... I promise I won't look.... 😏 ....unless??????? 😳`)
        .setFooter(`Requested by ${message.author.tag} ${tutuEmote} | by Vasilis#1517`, message.author.avatarURL())
        .addFields(
          { name: `nsfw`, value: `*r/porn, r/nsfw_gifs, r/The_Best_NSFW_GIFS, r/nsfwhardcore, r/VerticalGifs*: General NSFW gifs and porn` },
          { name: `nudes`, value: `*r/Nude_Selfie, r/RealGirls, r/LegalTeens, r/collegesluts*: Cute™ girls sharing (for some weird reason) their nudes online` },
          { name: `lesbians`, value: `*r/lesbians, r/Lesbian_gifs*: They do be kinda hot tho ngl` },
          { name: `rule34`, value: `*r/rule34*: In case you're into... this` },
          { name: `hentai`, value: `*r/hentai, r/HENTAI_GIF*` },
          { name: `boobs`, value: `*r/Boobies*: Boobies. Girl boobies.` },
          { name: `blowjob`, value: `*r/Blowjob*: No head? No problem` },
          { name: `threesome`, value: `*r/Xsome, r/Threesome, r/groupsex*: Threesomes, foursomes, fivesomes, etc. The more the better` },
        )

      if (nsfwDisableGuildID.includes(message.guild.id) === false) {
        message.channel.send({embeds: [nsfwEmbed]});
      } else {
        return errorNsfwDisabled(message, message.author.avatarURL(), message.author.tag)
      }

    } else {
      var helpEmbed = new Discord.MessageEmbed()
        .setColor(tutuColor)
        .setTitle(`Commands`)
        .setDescription(`These are the available commands for now, new ones getting added frequently. [Press here](https://imvasi.com/tutubot/#commands) to see a more detailed command list.`)
        .setFooter(`Requested by ${message.author.tag} ${tutuEmote} | by Vasilis#1517`, message.author.avatarURL())
        .addFields(
          { name: `help`, value: 'This command eliminates racism and brings you good luck for 8.2 years' },
          { name: `random [subreddit]`, value: 'Shows a random submission from a subreddit' },
          { name: `top [subreddit] (timespan)`, value: 'Shows the top posts of a subreddit\nAvailable timespans are: **hour, day, week, month, year, all**' },
          { name: `user [a Reddit user]`, value: 'Shows posts of a Reddit user' },
          { name: `id [a Reddit post ID]`, value: 'Gets a post from its ID' },
          { name: `search [subreddit] [query]`, value: 'Conducts a search on the defined subreddit' },
          { name: `asearch`, value: 'Stands for advanced search. Allows you to select the timespan and sorting of the search results. Execute the command for more info.' },
          { name: `urban [term]`, value: 'Shows the definition of any term using Urban Dictionary 😳' },
          { name: `dankmemes`, value: 'Shows a random meme from *r/dankmemes* & *r/memes*' },
          { name: `cat`, value: 'Shows a random picture of a meow from *r/cats* 🥺' },
          { name: `elephants`, value: 'Shows elephants from *r/babyelephantgifs* 🐘' },
        )
      if (nsfwDisableGuildID.includes(message.guild.id) === false) {
        helpEmbed.addField(`help nsfw`, `Feeling kinda........😏😏 No? Okay sorry`)
      }

      message.channel.send({embeds: [helpEmbed]});
    }
  },
};