const { nsfwDisableGuildID } = require(`${require.main.path}/config.json`);
const { prefix } = require(`${require.main.path}/config.json`);
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
                .setFooter(`Requested by ${message.author.tag} ${tutuEmote}`, message.author.avatarURL())
                .addFields(
                    { name: `${prefix}nsfw`, value: `*r/porn, r/nsfw_gifs, r/The_Best_NSFW_GIFS, r/nsfwhardcore, r/VerticalGifs*: General NSFW gifs and porn` },
                    { name: `${prefix}nudes`, value: `*r/Nude_Selfie, r/RealGirls, r/LegalTeens, r/collegesluts*: Cute™ girls sharing (for some weird reason) their nudes online` },
                    { name: `${prefix}lesbians`, value: `*r/lesbians, r/Lesbian_gifs*: They do be kinda hot tho ngl` },
                    { name: `${prefix}rule34`, value: `*r/rule34*: In case you're into... this` },
                    { name: `${prefix}hentai`, value: `*r/hentai, r/HENTAI_GIF*` },
                    { name: `${prefix}boobs`, value: `*r/Boobies*: Boobies. Girl boobies.` },
                    { name: `${prefix}blowjob`, value: `*r/Blowjob*: No head? No problem` },
                    { name: `${prefix}threesome`, value: `*r/Xsome, r/Threesome, r/groupsex*: Threesomes, foursomes, fivesomes, etc. The more the better` },
                )

            if (message.channel.type !== 'dm') {
                if (nsfwDisableGuildID.includes(message.guild.id) === false) {
                    message.channel.send(nsfwEmbed);
                } else {
                    return errorNsfwDisabled(message, message.author.avatarURL(), message.author.tag)
                }
            } else {
                message.channel.send(nsfwEmbed);
            }

        } else {
            var helpEmbed = new Discord.MessageEmbed()
                .setColor(tutuColor)
                .setTitle(`Commands`)
                .setDescription(`These are the available commands for now, new ones getting added frequently. [Press here](https://imvasi.com/tutubot/#commands) to see a more detailed command list.`)
                .setFooter(`Requested by ${message.author.tag} ${tutuEmote}`, message.author.avatarURL())
                .addFields(
                    { name: `${prefix}help`, value: 'This command eliminates racism and brings you good luck for 8.2 years' },
                    { name: `${prefix}reddit [subreddit]`, value: 'Shows a random submission from a subreddit' },
                    { name: `${prefix}reddit [subreddit] top (hour/day/week/month/year/all)`, value: 'Shows the top posts of a subreddit' },
                    { name: `${prefix}urban [term]`, value: 'Shows the definition of any term using Urban Dictionary 😳' },
                    { name: `${prefix}dankmemes`, value: 'Shows a random meme from *r/dankmemes* & *r/memes*' },
                    { name: `${prefix}cat`, value: 'Shows a random picture of a meow 🥺' },
                    { name: `${prefix}elephants`, value: 'Shows elephants from *r/babyelephantgifs* 🐘' },
                )
            if (message.channel.type !== 'dm') {
                if (nsfwDisableGuildID.includes(message.guild.id) === false) {
                    helpEmbed.addField(`${prefix}help nsfw`, `Feeling kinda........😏😏 No? Okay sorry`)
                }
            }

            message.channel.send(helpEmbed);
        }
    },
};