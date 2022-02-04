const snoowrap = require("snoowrap");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const { MessageActionRow, MessageButton } = require("discord.js");
const { redditCredentials } = require(`${require.main.path}/config.json`);
require(`${require.main.path}/events/embeds.js`)();
require(`${require.main.path}/commands/vasilis/reddit-log.js`)();

//connect with account
module.exports = function () {
  const r = new snoowrap({
    userAgent: "TutuBot",
    clientId: redditCredentials.app_id,
    clientSecret: redditCredentials.api_secret,
    username: redditCredentials.username,
    password: redditCredentials.password,
  });

  r.config({ warnings: true, maxRetryAttempts: 2, continueAfterRatelimitError: true });

  //get reddit post
  this.redditGetPost = async function (
    args,
    message,
    subreddit,
    rType,
    time,
    query,
    sort
  ) {
    if (!subreddit) {
      let errorMsg;
      if (rType === "user") {
        errorMsg = `Please provide a user.`;
      } else if (rType === "id") {
        errorMsg = `Please provide a post ID.`;
      } else {
        errorMsg = `Please provide a subreddit.`;
      }
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }

    let post;

    try {
      if (subreddit.length > 21) {
        subreddit = subreddit.slice(0, 21);
      }

      if (args != 0) {
        redditIntro(message, subreddit, rType, time, query, sort);
      }

      if (rType === "search") {
        await r
          .search({
            query: query,
            time: time,
            subreddit: subreddit,
            limit: 1,
            sort: sort,
            skipReplies: true,
          })
          .then(async (Listing) => {
            if (Listing.length < 1) {
              return errorNoResults(
                message,
                message.author.avatarURL(),
                message.author.tag
              );
            }
            post = Listing[0];
            rListing = Listing;
            redditPost(post, args, rType, message, subreddit);
          });
      }
      if (rType === "id") {
        post = await r.getSubmission(subreddit, { skipReplies: true }).fetch();
        redditPost(post, args, rType, message, subreddit);
      }
      if (rType === "user") {
        await r
          .getUser(subreddit)
          .getSubmissions({ limit: 1, skipReplies: true })
          .then(async (Listing) => {
            post = Listing[0];
            rListing = Listing;
            redditPost(post, args, rType, message, subreddit);
          });
      }
      if (rType === "top") {
        await r
          .getTop(args[0], { time: time, limit: 1, skipReplies: true })
          .then(async (Listing) => {
            post = Listing[0];
            rListing = Listing;
            redditPost(post, args, rType, message, subreddit);
          });
      }
      if (rType === "new") {
        await r
          .getNew(args[0], { limit: 1, skipReplies: true })
          .then(async (Listing) => {
            post = Listing[0];
            rListing = Listing;
            redditPost(post, args, rType, message, subreddit);
          });
      }
      if (rType === "random") {
        post = await r.getRandomSubmission(subreddit, { skipReplies: true });
        if (Array.isArray(post) && post.constructor.name === "Listing") {
          if (post.length === 0) {
            return errorNoResults(
              message,
              message.author.avatarURL(),
              message.author.tag
            );
          } else if (post.constructor.name === "Listing") {
            const errorMsg = `This subreddit doesn't support random posts. Please, use the **top** command instead.`;
            return errorEmbed(
              message,
              errorMsg,
              message.author.avatarURL(),
              message.author.tag
            );
          }
        }
        redditPost(post, args, rType, message, subreddit);
      }

      //what a mess...
    } catch (error) {
      if (error.statusCode === 503) {
        return error503Reddit(
          message,
          message.author.avatarURL(),
          message.author.tag
        );
      } else if (error.error.error === 404) {
        if (error.error.reason === "banned") {
          const errorMsg = `This community is banned.`;
          return errorEmbed(
            message,
            errorMsg,
            message.author.avatarURL(),
            message.author.tag
          );
        } else {
          return errorNoResults(
            message,
            message.author.avatarURL(),
            message.author.tag
          );
        }
      } else if (
        error.error.reason === "quarantined" &&
        error.error.quarantine_message
      ) {
        const errorMsg = `This community is [quarantined](https://www.reddithelp.com/en/categories/reddit-101/rules-reporting/account-and-community-restrictions/quarantined-subreddits).\n\n${error.error.quarantine_message}`;
        return errorEmbed(
          message,
          errorMsg,
          message.author.avatarURL(),
          message.author.tag
        );
      } else if (error.error.message) {
        const errorMsg = `Error ${error.error.error}: ${error.error.message} (${error.error.reason})`;
        return errorEmbed(
          message,
          errorMsg,
          message.author.avatarURL(),
          message.author.tag
        );
      } else {
        console.log(error);
        return errorNoResults(
          message,
          message.author.avatarURL(),
          message.author.tag
        );
      }
    }
  };

  //format and send post
  async function redditPost(post, args, rType, message, subreddit) {
    args = 0; //so it doesn't show the intro again
    let botMessage;

    if (typeof rListing !== "undefined") {
      if (rListing.length === 0) {
        return errorNoResults(
          message,
          message.author.avatarURL(),
          message.author.tag
        );
      }
    }

    try {
      if (post.removed_by_category === "deleted") {
        //check if post is deleted
        const errorMsg = `[This](https://reddit.com${post.permalink}) post has been deleted.`;
        return errorEmbed(
          message,
          errorMsg,
          message.author.avatarURL(),
          message.author.tag
        );
      }

      getPostId(post, message); //logging

      if (post.over_18 === true && !message.channel.nsfw) {
        //dont show nsfw post in non nsfw channel
        const rNsfw = {
          title: `Error`,
          description: `[This](https://reddit.com${post.permalink}) is a NSFW post, it can only be shown in NSFW channels.`,
          color: errorColor,
          footer: {
            icon_url: message.author.avatarURL(),
            text: `${message.author.tag} | [${post.id}]`,
          },
        };

        botMessage = await message.channel.send({ embeds: [rNsfw] }); //so that the reactions still work on the nsfw error

        if (rType === "top" || rType === "user" || rType === "search") {
          return redditTop(
            botMessage,
            rListing,
            args,
            rType,
            message,
            subreddit
          );
        } else if (rType === "random") {
          return randomPostReaction(
            botMessage,
            args,
            message,
            subreddit,
            rType
          );
        } else return;
      }

      let subText;
      let hasTxt;
      if (post.selftext !== "") {
        //if post has text
        subText = post.selftext;
        hasTxt = true;
      } else if (post.crosspost_parent_list) {
        //if post is crosspost
        if (post.crosspost_parent_list[0].selftext !== "") {
          //if crosspost has text
          subText = post.crosspost_parent_list[0].selftext;
          hasTxt = true;
        }
      }

      let hasUrl;
      if (post.url !== "") {
        //if post has url
        hasUrl = true;
      }

      let galleryIds = [];
      if (post.is_gallery === true) {
        //if post is gallery
        const validPosts = Object.values(post.media_metadata).filter(
          (image) => image.status === "valid"
        );
        for (let x = 0; x < validPosts.length; x++) {
          galleryIds[x] = `https://i.redd.it/${validPosts[x].id}.${validPosts[
            x
          ].m
            .split("/")
            .pop()}`;
        }
      } else if (post.crosspost_parent_list) {
        if (post.crosspost_parent_list[0].is_gallery === true) {
          const validPosts = Object.values(
            post.crosspost_parent_list[0].media_metadata
          ).filter((image) => image.status === "valid");
          for (let x = 0; x < validPosts.length; x++) {
            galleryIds[x] = `https://i.redd.it/${validPosts[x].id}.${validPosts[
              x
            ].m
              .split("/")
              .pop()}`;
          }
        }
      }

      //Text Posts
      if (hasTxt === true) {
        let rTitle;
        if (post.title.length > 256) {
          rTitle = `${post.title.slice(0, 253)}...`;
          subText = subText.replace(
            /^/,
            `...${post.title.slice(253, post.title.length)}\n\n---\n\n`
          );
        } else {
          rTitle = post.title;
        }

        const subIcon = await r.getSubreddit(post.subreddit.display_name)
          .community_icon;
        let rAuthor = "";
        if (post.pinned === true) {
          rAuthor = rAuthor.concat(`📌 `);
        }
        if (post.over_18 === true) {
          rAuthor = rAuthor.concat(`🔞 `);
        }
        if (post.archived === true) {
          rAuthor = rAuthor.concat(`🗃️ `);
        }
        if (post.locked === true) {
          rAuthor = rAuthor.concat(`🔒 `);
        }
        rAuthor = rAuthor.concat(`${post.subreddit_name_prefixed} •`);

        if (post.crosspost_parent_list) {
          rAuthor = rAuthor.concat(` 🔀 Crossposted`);
        }
        rAuthor = rAuthor.concat(` by u/${post.author.name}`);

        let rInfo = "";
        rInfo = rInfo.concat(`📅 <t:${post.created}:R>\n`);
        if (post.hide_score === false) {
          rInfo = rInfo.concat(
            `👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted)\n`
          );
        }
        rInfo = rInfo.concat(`💬 ${post.num_comments}`);

        const size = subText.length / 4096;
        let rText = [];
        for (let i = 0; i < size; i++) {
          rText[i] = subText.slice(4096 * i, 4096 * i + 4096);
        }

        for (let i = 0; i < rText.length; i++) {
          let rPost = new Discord.MessageEmbed()
            .setColor(tutuColor)
            .setTitle(rTitle)
            .setURL(`https://www.reddit.com${post.permalink}`)
            .setFooter(
              `Requested by ${message.author.tag} ${tutuEmote} | [${post.id}]`,
              message.author.avatarURL()
            )
            .setDescription(rText[i])
            .setAuthor(rAuthor, subIcon);

          if (i === rText.length - 1) {
            rPost.addField("Info", rInfo);
          }

          botMessage = await message.channel.send({ embeds: [rPost] });
        }

        if (rType === "random") {
          randomPostReaction(botMessage, args, message, subreddit, rType);
        }
      }

      //Non Text Posts
      if (hasUrl === true && hasTxt !== true) {
        let rMessage = "";
        if (post.pinned === true) {
          rMessage = rMessage.concat(`📌 `);
        }
        if (post.over_18 === true) {
          rMessage = rMessage.concat(`🔞 `);
        }
        if (post.archived === true) {
          rMessage = rMessage.concat(`🗃️ `);
        }
        if (post.locked === true) {
          rMessage = rMessage.concat(`🔒 `);
        }

        rMessage = rMessage.concat(`${post.subreddit_name_prefixed}`);
        rMessage = rMessage.concat(` •`);

        if (post.crosspost_parent_list) {
          rMessage = rMessage.concat(` 🔀 Crossposted`);
        }

        rMessage = rMessage.concat(
          ` by u/${post.author.name} • <t:${post.created}:R>\n`
        );

        if (post.hide_score === false) {
          rMessage = rMessage.concat(
            `👍 ${post.ups} (${post.upvote_ratio * 100}% upvoted) • `
          );
        }

        rMessage = rMessage.concat(`💬 ${post.num_comments}\n`);

        rMessage = rMessage.concat(`\n**${post.title}**\n`);

        if (post.crosspost_parent_list) {
          rMessage = rMessage.concat(
            `\n*${post.crosspost_parent_list[0].subreddit_name_prefixed} • by u/${post.crosspost_parent_list[0].author.name} • <t:${post.crosspost_parent_list[0].created}:R>\n${post.crosspost_parent_list[0].title}*\n`
          );
        }

        if (galleryIds.length > 0) {
          for (let x = 0; x < galleryIds.length; x++) {
            rMessage = rMessage.concat(`${galleryIds[x]}\n`);
          }
        } else if (post.media !== null && "reddit_video" in post.media) {
          rMessage = rMessage.concat(
            `${post.media.reddit_video.fallback_url}\n`
          );
        } else if (post.url.includes("redgifs.com/watch/")) {
          //redgifs intergration
          const redGifUrl = await fetch(
            `https://api.redgifs.com/v2/gifs/${
              post.url.split("/")[post.url.split("/").length - 1]
            }`
          ).then((response) => response.json());
          rMessage = rMessage.concat(`${redGifUrl.gif.urls.hd}\n`);
        } else if (!post.url.includes(post.id)) {
          rMessage = rMessage.concat(`${post.url}\n`);
        } else {
          rMessage = rMessage.concat(`\n`);
        }
        rMessage = rMessage.concat(
          `Requested by ${message.author.tag} ${tutuEmote} | [${post.id}]`
        );
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Open on Reddit")
            .setStyle("LINK")
            .setEmoji("874699801256681492") //custom emoji (reddit logo)
            .setURL(`https://reddit.com${post.permalink}`)
        );

        botMessage = await message.channel.send({
          content: rMessage,
          components: [row],
        });

        if (rType === "random") {
          randomPostReaction(botMessage, args, message, subreddit, rType);
        }
      }

      if (
        rType === "top" ||
        rType === "user" ||
        rType === "search" ||
        rType === "new"
      ) {
        redditTop(botMessage, rListing, args, rType, message, subreddit);
      }
    } catch (error) {
      console.log(error);
      return errorNoResults(
        message,
        message.author.avatarURL(),
        message.author.tag
      );
    }
  }

  //get top posts
  function redditTop(botMessage, Listing, args, rType, message, subreddit) {
    botMessage.react("⏩");
    const filter = (reaction, user) => {
      return reaction.emoji.name === "⏩" && user.id === message.author.id;
    };

    const collector = botMessage.createReactionCollector({
      filter,
      time: 6000000,
    });

    collector.on("collect", async (reaction, user) => {
      await Listing.fetchMore({
        amount: 1,
        skipReplies: true,
        append: false,
      }).then(async (Listing) => {
        if (Listing.isFinished === true) {
          let rFinished = new Discord.MessageEmbed()
            .setTitle(`That's all for now!`)
            .setColor(tutuColor)
            .setFooter(`${message.author.tag}`, message.author.avatarURL());
          if (rType === "top" || rType === "new") {
            rFinished.setDescription(
              "You saw all the available posts for this subreddit."
            );
          } else if (rType === "user") {
            rFinished.setDescription(
              "You saw all the available posts from this user."
            );
          } else {
            rFinished.setDescription(
              `You've reached the end of the search results.`
            );
          }
          return message.channel.send({ embeds: [rFinished] });
        }
        post = Listing[0];
        rListing = Listing;
        redditPost(post, args, rType, message, subreddit);
      });
      botMessage.reactions.cache.get("⏩").remove();
      collector.stop();
    });

    collector.on("end", (collected) => {
      botMessage.reactions.cache.get("⏩").remove();
    });
  }

  //react to random posts
  function randomPostReaction(botMessage, args, message, subreddit, rType) {
    botMessage.react("🔄");
    const filter = (reaction, user) => {
      return reaction.emoji.name === "🔄" && user.id === message.author.id;
    };

    const collector = botMessage.createReactionCollector({
      filter,
      time: 6000000,
    });

    collector.on("collect", async (reaction, user) => {
      await redditGetPost(args, message, subreddit, rType);
      botMessage.reactions.cache.get("🔄").remove();
      collector.stop();
    });

    collector.on("end", (collected) => {
      botMessage.reactions.cache.get("🔄").remove();
    });
  }

  async function redditIntro(message, subreddit, rType, time, query, sort) {
    let timespanTxt;
    let subredditTxt;
    if (time === "all") {
      timespanTxt = "any time";
    } else {
      timespanTxt = "this " + time;
    }
    if (subreddit === "all") {
      if (rType === "search") {
        subredditTxt = "all Reddit";
      } else {
        subredditTxt = "all Reddit posts";
      }
    } else {
      subredditTxt = subreddit;
    }

    let embedTitle;
    let embedMsg;
    if (rType === "search") {
      let queryTxt;
      if (query.length > 100) {
        queryTxt = query.slice(0, 100) + "...";
      } else {
        queryTxt = query;
      }
      embedTitle = "Reddit";
      embedMsg = `Searching for **${queryTxt}** in **${subredditTxt}** posts from **${timespanTxt}**, and sorting by **${sort}**...`;
    }
    if (rType === "id") {
      embedTitle = "Reddit";
      embedMsg = `Getting the Reddit post with ID **${subreddit}**...`;
    }
    if (rType === "user") {
      embedTitle = "Reddit";
      embedMsg = `Getting the posts of user **${subreddit}**...`;
    }
    if (rType === "top") {
      embedTitle = "Reddit";
      embedMsg = `Getting the top posts of **${timespanTxt}** from **${subredditTxt}**...`;
    }
    if (rType === "random") {
      embedTitle = "Reddit";
      embedMsg = `Getting random posts from **${subredditTxt}**...`;
    }
    if (rType === "new") {
      embedTitle = "Reddit";
      embedMsg = `Getting the new posts from **${subredditTxt}**...`;
    }
    msgEmbed(message, embedTitle, embedMsg);
  }
};
