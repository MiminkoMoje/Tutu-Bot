const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const { MessageButton } = require("discord-buttons")
const { ReactionCollector } = require('discord.js-collector')
const { redditCredentials } = require(`${require.main.path}/config.json`);
require(`${require.main.path}/events/embeds.js`)();
module.exports = {
    name: 'reddit',
    aliases: ['sub', 'r', 'submission', 'subreddit'],
    description: 'Shows a random Reddit post from your selected subreddit.',
    //guildOnly: true,
    async execute(message, args) {
        const r = new snoowrap({
            userAgent: 'TutuBot',
            clientId: redditCredentials.app_id,
            clientSecret: redditCredentials.api_secret,
            username: redditCredentials.username,
            password: redditCredentials.password
        });
        r.config({ warnings: true, maxRetryAttempts: 1 });

        function timeConverter(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            min = ('0' + min).slice(-2)
            //var sec = a.getSeconds();
            var time = `${month} ${date}, ${year} ${hour}:${min}`
            return time;
        }

        function redditSw(botMessage, Listing, args, rType) {
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
                        redditPost(post, args, rType)
                    }),
                },
                collectorOptions: {
                    time: 3000000
                }
            });
        }

        function randomPostReaction(botMessage, args) {
            ReactionCollector.question({
                botMessage,
                user: message.author,
                reactions: {
                    '🔄': async () => await getPost(args),
                },
                collectorOptions: {
                    time: 3000000
                }
            });
        }

        getPost(args);

        async function getPost(args) {

            if (!args[0]) {
                const errorMsg = `Please provide a subreddit.`
                return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
            }

            var post;
            var rType;

            try {
                if (args[1] === 'id' || args[1] === 'i') {
                    post = await r.getSubmission(args[0]).fetch();
                    rType = 'id'
                    redditPost(post, args, rType)
                } else if (args[1] === 'top') {
                    if (args[2] !== 'hour' && args[2] !== 'day' && args[2] !== 'week' && args[2] !== 'month' && args[2] !== 'year' && args[2] !== 'all') {
                        args[2] = 'day'
                    }
                    await r.getTop(args[0], { time: args[2], limit: 1 }).then(async Listing => {
                        post = Listing[0]
                        rListing = Listing
                        rType = 'top'
                        redditPost(post, args, rType)
                    })
                } else {
                    post = await r.getRandomSubmission(args[0]);
                    rType = 'random'
                    redditPost(post, args, rType)
                }
                //console.log(post)
            } catch (error) {
                if (error.statusCode === 503) {
                    return error503Reddit(message, message.author.avatarURL(), message.author.tag)
                } else if (error.error.message) {
                    const errorMsg = `Error ${error.error.error}: ${error.error.message} (${error.error.reason})`
                    return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
                } else {
                    return errorNoResults(message, message.author.avatarURL(), message.author.tag)
                }
            }
        }

        async function redditPost(post, args, rType) {
            try {
                if (post.removed_by_category === 'deleted') {
                    const errorMsg = `[This](${post.url}) post has been deleted.`
                    return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
                }

                if (post.over_18 === true && !message.channel.nsfw) {
                    const rNsfw = {
                        "title": `Error`,
                        "description": `[This](https://reddit.com${post.permalink}) is a NSFW post, please use a NSFW channel.`,
                        "color": errorColor,
                        "footer": {
                            "icon_url": message.author.avatarURL(),
                            "text": `${message.author.tag} | [${post.id}]`,
                        },
                    };

                    botMessage = await message.channel.send({ embed: rNsfw });

                    if (rType === 'top') {
                        return redditSw(botMessage, rListing, args)
                    } else if (rType === 'random') {
                        return randomPostReaction(botMessage, args)
                    } else return;
                }

                if (post.selftext !== '' || post.crosspost_parent_list) {
                    if (post.crosspost_parent_list) {
                        if (post.crosspost_parent_list[0].selftext !== '') {
                            var subText = post.crosspost_parent_list[0].selftext
                            var hasTxt = true
                        }
                    } else {
                        var subText = post.selftext
                        var hasTxt = true
                    }
                }

                if (post.url !== '') {
                    var hasUrl = true
                }

                if (post.is_gallery === true) {
                    var validPosts = Object.values(post.media_metadata).filter((image) => image.status === 'valid');
                    var galleryIds = []
                    for (x = 0; x < validPosts.length; x++) {
                        galleryIds[x] = `https://i.redd.it/${validPosts[x].id}.${validPosts[x].m.split('/').pop()}`
                    }
                }

                if (hasTxt === true) {
                    var rText = []
                    var size = subText.length / 4096;
                    const subIcon = await r.getSubreddit(post.subreddit.display_name).community_icon

                    for (let i = 0; i < size; i++) {
                        rText[i] = subText.slice(4096 * i, (4096 * i) + 4096)
                    }

                    for (let i = 0; i < rText.length; i++) {
                        var rPost = new Discord.MessageEmbed()
                            .setColor(tutuColor)
                            .setTitle(post.title)
                            .setURL(`https://www.reddit.com${post.permalink}`)
                            .setFooter(`Requested by ${message.author.tag} 💜 | [${post.id}]`, message.author.avatarURL())
                            .setDescription(rText[i])

                        rAuthor = `${post.subreddit_name_prefixed} •`

                        if (post.crosspost_parent_list) {
                            rAuthor = rAuthor.concat(` 🔀 Crossposted`)
                        }

                        rAuthor = rAuthor.concat(` by u/${post.author.name} • ${timeConverter(post.created_utc)}`)

                        rPost.setAuthor(rAuthor, subIcon)

                        if (i === rText.length - 1 && post.hide_score === false) {
                            rPost.addField('Score', `👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted)`)
                        }
                        var botMessage = await message.channel.send(rPost)
                    }

                    if (rType === 'random') {
                        randomPostReaction(botMessage, args);
                    }
                }

                if (hasUrl === true && hasTxt !== true) {
                    rMessage = `${post.subreddit_name_prefixed} •`

                    if (post.crosspost_parent_list) {
                        rMessage = rMessage.concat(` 🔀 Crossposted`)
                    }

                    rMessage = rMessage.concat(` by u/${post.author.name} • ${timeConverter(post.created_utc)}\n`)

                    if (post.hide_score === false) {
                        rMessage = rMessage.concat(`👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted)\n`)
                    }
                    rMessage = rMessage.concat(`\n**${post.title}**\n`)

                    if (post.is_gallery === true) {
                        for (x = 0; x < galleryIds.length; x++) {
                            rMessage = rMessage.concat(`${galleryIds[x]}\n`)
                        }
                    } else if (!post.url.includes(post.id)) {
                        rMessage = rMessage.concat(`${post.url}\n`)
                    } else {
                        rMessage = rMessage.concat(`\n`)
                    }
                    rMessage = rMessage.concat(`Requested by ${message.author.tag} 💜 | [${post.id}]`)

                    let rButton = new MessageButton()
                        .setLabel("Open on Reddit")
                        .setStyle("url")
                        .setEmoji("🟠")
                        .setURL(`https://reddit.com${post.permalink}`)

                    var botMessage = await message.channel.send(rMessage, { buttons: [rButton] });

                    if (rType === 'random') {
                        randomPostReaction(botMessage, args);
                    }
                }

                if (rType == 'top') {
                    redditSw(botMessage, rListing, args, rType)
                }

            } catch (error) {
                console.log(error)
                return errorNoResults(message, message.author.avatarURL(), message.author.tag)
            }
        }
    },
};