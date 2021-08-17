const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { redditCredentials } = require(`${require.main.path}/config.json`);
require(`${require.main.path}/events/embeds.js`)();
const { prefix } = require(`${require.main.path}/config.json`);

//connect with account
module.exports = function () {
  const r = new snoowrap({
    userAgent: 'TutuBot',
    clientId: redditCredentials.app_id,
    clientSecret: redditCredentials.api_secret,
    username: redditCredentials.username,
    password: redditCredentials.password
  });
  r.config({ warnings: false, maxRetryAttempts: 2 });

  //format unix timestamp
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

  //format and send post
  async function redditPost(post, args, rType, message, subreddit, subreddits) {
    try {
      if (post.removed_by_category === 'deleted') {  //check if post is deleted
        const errorMsg = `[This](${post.url}) post has been deleted.`
        return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
      }

      if (post.over_18 === true && !message.channel.nsfw) { //check if post is nsfw if not using an nsfw channel
        const rNsfw = {
          "title": `Error`,
          "description": `[This](https://reddit.com${post.permalink}) is a NSFW post, please use a NSFW channel.`,
          "color": errorColor,
          "footer": {
            "icon_url": message.author.avatarURL(),
            "text": `${message.author.tag} | [${post.id}]`,
          },
        };

        botMessage = await message.channel.send({ embeds: [rNsfw] }); //so that the reactions still work on the nsfw error

        if (rType === 'top' || rType === 'user' || rType === 'search') {
          return redditTop(botMessage, rListing, args, rType, message, subreddit)
        } else if (rType.includes('random')) {
          return randomPostReaction(botMessage, args, message, subreddit, rType, subreddits)
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
        if (rType === 'random-predefined-image') {
          return redditGetPost(args, message, subreddit, rType, subreddits)
        }
        var rText = []
        var size = subText.length / 4096;
        const subIcon = await r.getSubreddit(post.subreddit.display_name).community_icon

        for (let i = 0; i < size; i++) {
          rText[i] = subText.slice(4096 * i, (4096 * i) + 4096)
        }

        if (post.title.length > 256) {
          var rTitle = `${post.title.slice(0, 253)}...`
          rText[0] = rText[0].replace(/^/, `...${post.title.slice(253, post.title.length)}\n\n---\n\n`)
        } else { rTitle = post.title }

        for (let i = 0; i < rText.length; i++) {
          var rPost = new Discord.MessageEmbed()
            .setColor(tutuColor)
            .setTitle(rTitle)
            .setURL(`https://www.reddit.com${post.permalink}`)
            .setFooter(`Requested by ${message.author.tag} ${tutuEmote} | [${post.id}]`, message.author.avatarURL())
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
          var botMessage = await message.channel.send({ embeds: [rPost] })
        }

        if (rType.includes('random')) {
          randomPostReaction(botMessage, args, message, subreddit, rType, subreddits);
        }
      }

      if (hasUrl === true && hasTxt !== true) {
        rMessage = `${post.subreddit_name_prefixed}`
        if (!rType.includes('random-predefined')) {

          rMessage = rMessage.concat(` •`)

          if (post.crosspost_parent_list) {
            rMessage = rMessage.concat(` 🔀 Crossposted`)
          }

          rMessage = rMessage.concat(` by u/${post.author.name} • ${timeConverter(post.created_utc)}\n`)

          if (post.hide_score === false) {
            rMessage = rMessage.concat(`👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted)\n`)
          }
        }
        rMessage = rMessage.concat(`\n**${post.title}**\n`)

        if (post.is_gallery === true) {
          for (x = 0; x < galleryIds.length; x++) {
            rMessage = rMessage.concat(`${galleryIds[x]}\n`)
          }
        } else if (!post.url.includes(post.id)) {
          rMessage = rMessage.concat(`${post.url}\n`)
        } else {
          if (rType === 'random-predefined-image') {
            return redditGetPost(args, message, subreddit, rType, subreddits)
          }
          rMessage = rMessage.concat(`\n`)
        }
        rMessage = rMessage.concat(`Requested by ${message.author.tag} ${tutuEmote} | [${post.id}]`)
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
          .setLabel("Open on Reddit")
              .setStyle("LINK")
              .setEmoji("874699801256681492") //custom emoji (reddit logo)
          .setURL(`https://reddit.com${post.permalink}`)
          );

        var botMessage = await message.channel.send({ content: rMessage, components: [row] });

        if (rType.includes('random')) {
          randomPostReaction(botMessage, args, message, subreddit, rType, subreddits);
        }
      }

      if (rType == 'top' || rType == 'user' || rType === 'search') {
        redditTop(botMessage, rListing, args, rType, message, subreddit)
      }

    } catch (error) {
      return errorNoResults(message, message.author.avatarURL(), message.author.tag)
    }
  }

  //get top posts
  function redditTop(botMessage, Listing, args, rType, message, subreddit) {
    botMessage.react('⏩')
    const filter = (reaction, user) => {
      return reaction.emoji.name === '⏩' && user.id === message.author.id;
    };

    const collector = botMessage.createReactionCollector({ filter, time: 6000000 });

    collector.on('collect', async (reaction, user) => {
      await Listing.fetchMore({ amount: 1, skipReplies: true, append: false }).then(async Listing => {
          if (Listing.isFinished === true) {
            var rFinished = new Discord.MessageEmbed()
              .setTitle(`That's all for now!`)
              .setColor(tutuColor)
              .setFooter(`${message.author.tag}`, message.author.avatarURL())
            if (rType === 'top') {
              rFinished.setDescription('You saw all the available posts for this subreddit.')
          } else if (rType === 'user') {
              rFinished.setDescription('You saw all the available posts from this user.')
          } else {
            rFinished.setDescription(`You've reached the end of the search results.`)
            }
          return message.channel.send({ embeds: [rFinished] });
          }
          post = Listing[0]
          rListing = Listing
          redditPost(post, args, rType, message, subreddit)
      })
      botMessage.reactions.cache.get('⏩').remove()
      collector.stop()
    });

    collector.on('end', collected => {
      botMessage.reactions.cache.get('⏩').remove()
    });
  }

  //react to random posts
  function randomPostReaction(botMessage, args, message, subreddit, rType, subreddits) {
    botMessage.react('🔄')
    const filter = (reaction, user) => {
      return reaction.emoji.name === '🔄' && user.id === message.author.id;
    };

    const collector = botMessage.createReactionCollector({ filter, time: 6000000 });

    collector.on('collect', async (reaction, user) => {
      await redditGetPost(args, message, subreddit, rType, subreddits)
      botMessage.reactions.cache.get('🔄').remove()
      collector.stop()
    })

    collector.on('end', collected => {
      botMessage.reactions.cache.get('🔄').remove()
    });
  }

  //get reddit post
  this.redditGetPost = async function (args, message, subreddit, rType, subreddits, time, query, sort) {
    subreddits = subreddits || 0;
    if (!subreddit) {
      if (rType === 'user') {
        var errorMsg = `Please provide a user.`
      } else if (rType === 'id') {
        var errorMsg = `Please provide a post ID.`
      } else {
        var errorMsg = `Please provide a subreddit.`
      }
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    var post;

    try {
      if (subreddits === 0) {
        var subreddits = subreddit
      }

      if (Array.isArray(subreddits)) {
        const subNum = Math.random() * subreddits.length | 0;
        subreddit = subreddits[subNum]
      }

      if (rType.includes('random-predefined')) {
        post = await r.getRandomSubmission(subreddit);
        redditPost(post, args, rType, message, subreddit, subreddits)
      }
      if (rType === 'search') {
        await r.search({ query: query, time: time, subreddit: subreddit, limit: 1, sort: sort }).then(async Listing => {
          if (Listing.length < 1) {
            return errorNoResults(message, message.author.avatarURL(), message.author.tag)
          }
          post = Listing[0]
          rListing = Listing
          redditPost(post, args, rType, message, subreddit)
        })
      }
      if (rType === 'id') {
        post = await r.getSubmission(subreddit).fetch();
        redditPost(post, args, rType, message, subreddit)
      }
      if (rType === 'user') {
        await r.getUser(subreddit).getSubmissions({ limit: 1 }).then(async Listing => {
          post = Listing[0]
          rListing = Listing
          redditPost(post, args, rType, message, subreddit)
        })
      }
      if (rType === 'top') {
        await r.getTop(args[0], { time: time, limit: 1 }).then(async Listing => {
          post = Listing[0]
          rListing = Listing
          redditPost(post, args, rType, message, subreddit)
        })
      }
      if (rType === 'random') {
        post = await r.getRandomSubmission(subreddit);
        if (Array.isArray(post) && post.constructor.name === 'Listing') {
          if (post.length === 0) {
            return errorNoResults(message, message.author.avatarURL(), message.author.tag)
          } else if (post.constructor.name === 'Listing') {
            const errorMsg = `This subreddit doesn't support random posts. Please, use the **top** command instead.`
          return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
          }
        }
        redditPost(post, args, rType, message, subreddit)
      }

      //what a mess...
    } catch (error) {
      if (error.statusCode === 503) {
        return error503Reddit(message, message.author.avatarURL(), message.author.tag)
      } else if (error.error.error === 404) {
        if (error.error.reason === 'banned') {
          const errorMsg = `This subreddit is banned.`
          return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag);
        } else {
        return errorNoResults(message, message.author.avatarURL(), message.author.tag)
        }
      } else if (error.error.reason === 'quarantined' && error.error.quarantine_message) {
        const errorMsg = `This community is [quarantined](https://www.reddithelp.com/en/categories/reddit-101/rules-reporting/account-and-community-restrictions/quarantined-subreddits).\n\n${error.error.quarantine_message}`
        return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag);
      }
       else if (error.error.message) {
        const errorMsg = `Error ${error.error.error}: ${error.error.message} (${error.error.reason})`
        return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
      }
      else {
        return errorNoResults(message, message.author.avatarURL(), message.author.tag)
      }
    }
  }
}