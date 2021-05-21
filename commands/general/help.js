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
                .setFooter(`Requested by ${message.author.tag} 💜`, message.author.avatarURL())
                .addFields(
                    { name: ',nsfw', value: `*r/porn, r/NSFW_GIF, r/nsfw_gifs, r/The_Best_NSFW_GIFS, r/nsfwhardcore, r/VerticalGifs, r/gifsgonewild*: General NSFW gifs and porn` },
                    { name: ',nudes', value: `*r/Nude_Selfie*: Cute™ girls sharing (for some weird reason) their nudes online` },
                    { name: ',realgirls', value: `*r/RealGirls*: Yes, they're real. (They're naked too)` },
                    { name: ',legalteens', value: `*r/LegalTeens*: Just about 😳` },
                    { name: ',collegesluts', value: `*r/collegesluts*: Women from college I guess? Naked women I mean.` },
                    { name: ',lesbians', value: `*r/lesbians, r/Lesbian_gifs*: They do be kinda hot tho ngl` },
                    { name: ',rule34', value: `*r/rule34*: In case you're into... this` },
                    { name: ',hentai', value: `*r/hentai, r/HENTAI_GIF*` },
                    { name: ',boobs', value: `*r/Boobies*: Boobies. Girl boobies.` },
                    { name: ',blowjob', value: `*r/Blowjob*: No head? No problem` },
                    { name: ',threesome', value: `*r/Xsome, r/Threesome, r/groupsex*: Threesomes, foursomes, fivesomes, etc. The more the better` },
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
                .setDescription(`These are the available commands for now, new ones getting added frequently.`)
                .setFooter(`Requested by ${message.author.tag} 💜`, message.author.avatarURL())
                .addFields(
                    { name: ',help', value: 'This command eliminates racism and brings you good luck for 8.2 years' },
                    { name: ',reddit [subreddit]', value: 'Shows a random submission from a subreddit' },
                    { name: ',urban [term]', value: 'Shows the definition of any term using Urban Dictionary 😳' },
                    { name: ',dankmemes', value: 'Shows a random meme from *r/dankmemes*' },
                    { name: ',cat', value: 'Shows a random picture of a meow 🥺' },
                    { name: ',coinflip', value: 'Flips a coin using a very sophisticated technology by NASA called RNG' },
                    { name: ',pp', value: `Once and for all exposes yours and your friends' penis size` },
                )
            if (message.channel.type !== 'dm') {
                if (nsfwDisableGuildID.includes(message.guild.id) === false) {
                    helpEmbed.addField(',help nsfw', `Feeling kinda........😏😏 No? Okay sorry`)
                }
            }

            message.channel.send(helpEmbed);
        }
    },
};