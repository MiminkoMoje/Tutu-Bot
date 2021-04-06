const snoowrap = require('snoowrap');
const { redditCredentials } = require(`${require.main.path}/config.json`);
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

        if (!args[0]) {
            const ErrorMsg = {
                "title": `Error`,
                "description": `Please supply a subreddit.`,
                "color": errorColor,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `${message.author.tag}`,
                },
            };
            return message.channel.send({ embed: ErrorMsg });
        }

        var post;

        try {
            post = await r.getSubmission(args[0]).fetch();
        } catch (err) {
            post = await r.getRandomSubmission(args[0]);
        }
        if (!post.title) {
            return message.channel.send({ embed: noResultsMsg });
        }
        if (post.over_18 === true && !message.channel.nsfw) {
            const rNsfw = {
                "title": `Error`,
                "description": `[This](${post.url}) is a NSFW post, please use a NSFW channel.`,
                "color": errorColor,
                "footer": {
                    "icon_url": message.author.avatarURL(),
                    "text": `${message.author.tag}`,
                },
            };
            return message.channel.send({ embed: rNsfw });
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
            const size = subText.length / 2040;
            for (let i = 0; i < size; i++) {
                const rSubmission = {
                    "title": post.title,
                    "url": post.url,
                    "description": subText.slice(2040 * i, (2040 * i) + 2040),
                    "color": tutuColor,
                    "footer": {
                        "icon_url": message.author.avatarURL(),
                        "text": `Requested by ${message.author.tag} 💜 | by u/${post.author.name} in ${post.subreddit_name_prefixed}`,
                    },
                };
                message.channel.send({ embed: rSubmission });
            }
        }
        if (hasUrl === true && hasTxt !== true) {
            message.channel.send(`${post.url}\n**${post.title}**\n*by u/${post.author.name} in ${post.subreddit_name_prefixed}*`)
        }

        if (hasImg === true) {
            const image = post.url.replace('gifv', 'gif');
            if (hasTxt === true) {
                message.channel.send(`${image}`)
            } else {
                message.channel.send(`${image}\n**${post.title}**\n*by u/${post.author.name} in ${post.subreddit_name_prefixed}*`)
            }
        }
        console.log(post)
    },
};

