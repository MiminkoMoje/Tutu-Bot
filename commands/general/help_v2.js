module.exports = {
    name: 'help',
    description: 'Shows the available commands.',
    execute(message, args) {
        if (args[0] === 'nsfw' && args[1] === 'old') {
            const nsfw_deprecated = {
                "title": `Deprecated NSFW Commands`,
                "description": `These are old and unsupported NSFW commands based on the NekoClient. They have been replaced with the new Reddit-based commands: **,help nsfw**.`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `Requested by ${message.author.tag} 💜`,
                },
                "fields": [
                    {
                        "name": ",blowjob-deprecated",
                        "value": `Blowjob`
                    },
                    {
                        "name": ",boobs-deprecated",
                        "value": `Boobs`
                    },
                    {
                        "name": ",girlsolo",
                        "value": `Girl`
                    },
                    {
                        "name": ",girlsolo gif",
                        "value": `Gif girl`
                    },
                    {
                        "name": ",hentai-deprecated",
                        "value": `Hentai`
                    },
                    {
                        "name": ",hentai-deprecated gif",
                        "value": `Gif hentai`
                    },
                    {
                        "name": ",lesbian-deprecated",
                        "value": `Lesbian`
                    },
                ]
            };
            if (message.channel.type === 'dm') { message.channel.send({ embed: nsfw_deprecated }) }
            else if (nsfwDisableID.includes(message.guild.id)) {
                message.channel.send({ embed: nsfwErrorMsg })
            } else { message.channel.send({ embed: nsfw_deprecated }) }
        } else if (args[0] === 'nsfw') {
            const nsfw = {
                "title": `NSFW Commands`,
                "description": `You don't have to go to horny jail anymore`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `Requested by ${message.author.tag} 💜`,
                },
                "fields": [
                    {
                        "name": ",nsfw",
                        "value": `*r/porn, r/NSFW_GIF, r/nsfw_gifs, r/The_Best_NSFW_GIFS, r/nsfwhardcore, r/VerticalGifs, r/gifsgonewild*: General NSFW gifs and porn`
                    },
                    {
                        "name": ",nudes",
                        "value": `*r/Nude_Selfie*: Cute™ girls sharing (for some weird reason) their nudes online`
                    },
                    {
                        "name": ",realgirls",
                        "value": `*r/RealGirls*: Yes, they're real. (They're naked too)`
                    },
                    {
                        "name": ",legalteens",
                        "value": `*r/LegalTeens*: Just about 😳`
                    },
                    {
                        "name": ",collegesluts",
                        "value": `*r/collegesluts*: Women from college I guess? Naked women I mean.`
                    },
                    {
                        "name": ",lesbians",
                        "value": `*r/lesbians, r/Lesbian_gifs*: They do be kinda hot tho ngl`
                    },
                    {
                        "name": ",rule34",
                        "value": `*r/rule34*: In case you're into... this`
                    },
                    {
                        "name": ",hentai",
                        "value": `*r/hentai, r/HENTAI_GIF*`
                    },
                    {
                        "name": ",boobs",
                        "value": `*r/Boobies*: Boobies. Girl boobies.`
                    },
                    {
                        "name": ",blowjob",
                        "value": `*r/Blowjob*: No head? No problem`
                    },
                    {
                        "name": ",threesome",
                        "value": `*r/Xsome, r/Threesome, r/groupsex*: Threesomes, foursomes, fivesomes, etc. The more the better`
                    },
                    {
                        "name": ",help nsfw old",
                        "value": `Deprecated and unsupported NSFW commands because they suck (hentai and cartoony content)`
                    },
                ]
            };
            if (message.channel.type === 'dm') { message.channel.send({ embed: nsfw }) }
            else if (nsfwDisableID.includes(message.guild.id)) {
                message.channel.send({ embed: nsfwErrorMsg })
            } else { message.channel.send({ embed: nsfw }) }
        } else {
            const commands = {
                "title": `Commands`,
                "description": `These are the available commands for now, new ones getting added frequently.`,
                "color": 8340223,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `Requested by ${message.author.tag} 💜`,
                },
                "fields": [
                    {
                        "name": ",help",
                        "value": `This command eliminates racism and brings you good luck for 8.2 years`
                    },
                    {
                        "name": ",urban [term]",
                        "value": `Shows the definition of any term using Urban Dictionary 😳`
                    },
                    {
                        "name": ",dankmemes",
                        "value": `Shows a random meme from *r/dankmemes*`
                    },
                    {
                        "name": ",cat",
                        "value": `Shows a random picture of a meow`
                    },
                    {
                        "name": ",coinflip",
                        "value": `Flips a coin using a very sophisticated technology by NASA called RNG`
                    },
                    {
                        "name": ",pp",
                        "value": `Once and for all exposes yours and your friends' penis size`
                    },
                    {
                        "name": ",help nsfw",
                        "value": `Feeling kinda 😏😏,,,,,, No? Okay sorry`
                    },
                ]
            };
            message.channel.send({ embed: commands })
        }

    },
};