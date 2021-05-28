const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const { ReactionCollector } = require('discord.js-collector')
const { redditCredentials } = require(`${require.main.path}/config.json`);
require(`${require.main.path}/events/embeds.js`)();
module.exports = {
    name: 'reddit',
    aliases: ['sub', 'r', 'submission', 'subreddit'],
    description: 'Shows a random Reddit post from your selected subreddit.',
    guildOnly: true,
    async execute(message, args) {
        const r = new snoowrap({
            userAgent: 'TutuBot',
            clientId: redditCredentials.app_id,
            clientSecret: redditCredentials.api_secret,
            username: redditCredentials.username,
            password: redditCredentials.password
        });

        function timeConverter(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            //var hour = a.getHours();
            //var min = a.getMinutes();
            //var sec = a.getSeconds();
            var time = `${month} ${date}, ${year}`
            return time;
        }

        function redditSw(botMessage, Listing, args) {
            ReactionCollector.question({
                botMessage,
                user: message.author,
                reactions: {
                    '⏩': async () => await Listing.fetchMore({ amount: 1, skipReplies: true, append: false }).then(async Listing => {
                        if (Listing.isFinished === true) {
                            const rFinished = {
                                "title": `That's all for now!`,
                                "description": `You saw all the available posts for this subreddit.`,
                                "color": tutuColor,
                                "footer": {
                                    "icon_url": message.author.avatarURL(),
                                    "text": `${message.author.tag}`,
                                },
                            };
                            return message.channel.send({ embed: rFinished });
                        }
                        post = Listing[0]
                        rListing = Listing
                        redditPost(post, args)
                    }),
                },
                collectorOptions: {
                    time: 3000000
                }
            });
        }

        if (!args[0]) {
            const errorMsg = `Please supply a subreddit.`
            return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
        }

        var post;

        try {
            if (args[1] === 'id' || args[1] === 'i') {
                post = await r.getSubmission(args[0]).fetch();
                redditPost(post, args)
            } else if (args[1] === 'top') {
                if (args[2] !== 'hour' && args[2] !== 'day' && args[2] !== 'week' && args[2] !== 'month' && args[2] !== 'year' && args[2] !== 'all') {
                    args[2] = 'day'
                }
                await r.getTop(args[0], { time: args[2], limit: 1 }).then(async Listing => {
                    post = Listing[0]
                    rListing = Listing
                    redditPost(post, args)
                })
            }
            else {
                post = await r.getRandomSubmission(args[0]);
                redditPost(post, args)
            }
        } catch (error) {
            if (error.statusCode === 503) {
                return error503Reddit(message, message.author.avatarURL(), message.author.tag)
            } else {
                console.log(error)
                return errorNoResults(message, message.author.avatarURL(), message.author.tag)
            }
        }

        async function redditPost(post, args) {
            try {
                if (post.over_18 === true && !message.channel.nsfw) {
                    const rNsfw = {
                        "title": `Error`,
                        "description": `[This](${post.url}) is a NSFW post, please use a NSFW channel.`,
                        "color": errorColor,
                        "footer": {
                            "icon_url": message.author.avatarURL(),
                            "text": `${message.author.tag} | [${post.name}]`,
                        },
                    };
                    botMessage = await message.channel.send({ embed: rNsfw });
                    if (args[1] === 'top') { return redditSw(botMessage, rListing, args) }
                    else return;
                }
                let _a;
                const hasImg = /(jpe?g|png|gif)/.test((_a = post === null || post === void 0 ? void 0 : post) === null || _a === void 0 ? void 0 : _a.url);
                if (post.selftext !== '') {
                    var hasTxt = true
                    var subText = post.selftext
                }
                if (post.url !== '' && hasImg === false) {
                    var hasUrl = true
                }
                
                if (hasTxt === true) {
                    var rText = []
                    var size = subText.length / 2040;
                    const subIcon = await r.getSubreddit(post.subreddit.display_name).community_icon

                    for (let i = 0; i < size; i++) {
                        rText[i] = subText.slice(2040 * i, (2040 * i) + 2040)
                    }

                    for (let i = 0; i < rText.length; i++) {
                        var rPost = new Discord.MessageEmbed()
                            .setColor(tutuColor)
                            .setTitle(post.title)
                            .setURL(post.url)
                            .setFooter(`Requested by ${message.author.tag} 💜 | [${post.id}]`, message.author.avatarURL())
                            .setAuthor(`${post.subreddit_name_prefixed} • by u/${post.author.name} • ${timeConverter(post.created)}`, subIcon)
                            .setDescription(rText[i])

                        if (i === rText.length - 1 && post.hide_score === false) {
                            rPost.addField('Score', `👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted)`)
                        }
                        var botMessage = await message.channel.send(rPost)
                    }
                }
                if (hasUrl === true && hasTxt !== true) {
                    rMessage = `${post.subreddit_name_prefixed} • by u/${post.author.name} • ${timeConverter(post.created)}\n`
                    if (post.hide_score === false) {
                        rMessage = rMessage.concat(`👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted)\n`)
                    }
                    rMessage = rMessage.concat(`\n**${post.title}**\n${post.url}\nRequested by ${message.author.tag} 💜 | [${post.id}]`)
                    var botMessage = await message.channel.send(rMessage)
                }

                if (hasImg === true) {
                    const image = post.url.replace('gifv', 'gif');
                    rMessage = `${post.subreddit_name_prefixed} • by u/${post.author.name} • ${timeConverter(post.created)}\n`
                    if (post.hide_score === false) {
                        rMessage = rMessage.concat(`👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted)\n`)
                    }
                    rMessage = rMessage.concat(`\n**${post.title}**\n${image}\nRequested by ${message.author.tag} 💜 | [${post.id}]`)
                    var botMessage = await message.channel.send(rMessage)
                }

                if (args[1] == 'top') {
                    redditSw(botMessage, rListing, args)
                }

            } catch (error) {
                console.log(error)
                return errorNoResults(message, message.author.avatarURL(), message.author.tag)
            }
        }
    },
};

