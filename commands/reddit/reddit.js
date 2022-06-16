const snoowrap = require("snoowrap");
const fetch = require("node-fetch");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { redditCredentials } = require(`${require.main.path}/config.json`);

module.exports = function () {
  const r = new snoowrap({
    userAgent: "TutuBot",
    clientId: redditCredentials.app_id,
    clientSecret: redditCredentials.api_secret,
    username: redditCredentials.username,
    password: redditCredentials.password,
  });

  r.config({
    warnings: true,
    maxRetryAttempts: 2,
    continueAfterRatelimitError: true,
  });

  this.getPost = async function (message, options) {
    if (options.type === "user" && !options.subreddit) {
      return errorEmbed(message, `Please provide a user.`);
    } else if (options.type === "id" && !options.subreddit) {
      return errorEmbed(message, `Please provide a post ID.`);
    } else if (!options.subreddit) {
      return errorEmbed(message, `Please provide a subreddit.`);
    }

    if (
      options.subreddit.toLowerCase().startsWith("r/") ||
      options.subreddit.toLowerCase().startsWith("u/")
    ) {
      options.subreddit = options.subreddit.slice(2);
    }

    options.subreddit = options.subreddit.slice(0, 21).toLowerCase();

    msgEmbed(message, "Reddit", intro(options));

    try {
      if (options.type === "top") {
        options.listing = await r.getTop(options.subreddit, {
          time: options.time,
          limit: 1,
          skipReplies: true,
        });
      } else if (options.type === "user") {
        options.listing = await r
          .getUser(options.subreddit)
          .getSubmissions({ limit: 1 });
      } else if (options.type === "id") {
        options.listing = await r
          .getSubmission(options.subreddit, { skipReplies: true })
          .fetch();
      } else if (options.type === "new") {
        options.listing = await r.getNew(options.subreddit, {
          limit: 1,
          skipReplies: true,
        });
      } else if (options.type === "hot") {
        options.listing = await r.getHot(options.subreddit, {
          limit: 1,
          skipReplies: true,
        });
      } else if (options.type === "rising") {
        options.listing = await r.getRising(options.subreddit, {
          limit: 1,
          skipReplies: true,
        });
      } else if (options.type === "controversial") {
        options.listing = await r.getControversial(options.subreddit, {
          limit: 1,
          skipReplies: true,
        });
      } else if (options.type === "random") {
        options.listing = await r.getRandomSubmission(options.subreddit, {
          skipReplies: true,
        });
      } else if (options.type === "search") {
        options.listing = await r.search({
          query: options.query,
          time: options.time,
          subreddit: options.subreddit,
          sort: options.sort,
          limit: 1,
          skipReplies: true,
        });
      } else if (options.type === "subreddits") {
        options.listing = await r.getPopularSubreddits({ limit: 11 });
        return popularSubs(message, options);
      }
      sendPost(message, options);
    } catch (error) {
      if (typeof error.error !== "undefined") {
        let errTitle, errDesc;
        if (error.error.reason === "quarantined") {
          errTitle = "Quarantined";
          errDesc = `This community is [quarantined](https://www.reddithelp.com/en/categories/reddit-101/rules-reporting/account-and-community-restrictions/quarantined-subreddits).\n\n${error.error.quarantine_message}`;
        } else if (error.error.reason === "banned") {
          errTitle = "Banned";
          errDesc = "This community is banned.";
        } else if (error.error.reason === "private") {
          errTitle = "Private";
          errDesc = "This community is private.";
        } else if (error.statusCode === 404) {
          errTitle = "Error";
          errDesc = "No results found.";
        } else if (error.statusCode === 503) {
          errTitle = "Error 503";
          errDesc =
            "Reddit servers are unavailable right now, please try again.";
        } else {
          errTitle = "Error";
          error.statusCode && (errTitle += ` ${error.statusCode}`);
          errDesc = error.error.message || "Unknown error.";
          error.error.reason && (errDesc += `\n${error.error.reason}`);
        }
        return customErrorEmbed(message, errTitle, errDesc);
      } else {
        console.log(error);
        return errorEmbed(message, "An error occurred.");
      }
    }
  };

  async function sendPost(message, options) {
    if (options.listing.length === 0) {
      return errorNoResults(message);
    }

    if (
      options.type === "random" &&
      Array.isArray(options.listing) &&
      options.listing.constructor.name === "Listing"
    ) {
      return errorEmbed(
        message,
        "This subreddit doesn't support random posts."
      );
    }

    const post = options.listing[0] || options.listing;

    //Skip pinned post
    if (options.type === "hot" && (post.stickied || post.pinned)) {
      return nextPost(message, options);
    }

    if (post.removed_by_category) {
      if (post.removed_by_category === "deleted") {
        options.botMessage = await errorEmbed(
          message,
          `[This](https://reddit.com${post.permalink}) post was deleted by the person who originally posted it.`
        );
      } else if (post.removed_by_category === "reddit") {
        options.botMessage = await errorEmbed(
          message,
          `[This](https://reddit.com${post.permalink}) post has been removed by Reddit.`
        );
      } else if (post.removed_by_category === "moderator") {
        options.botMessage = await errorEmbed(
          message,
          `[This](https://reddit.com${post.permalink}) post has been removed by the moderators of ${post.subreddit_name_prefixed}.`
        );
      } else if (post.removed_by_category === "copyright_takedown") {
        options.botMessage = await errorEmbed(
          message,
          `[This](https://reddit.com${post.permalink}) post has been removed by Reddit's Legal Operations team.`
        );
      } else if (post.removed_by_category === "community_ops") {
        options.botMessage = await errorEmbed(
          message,
          `[This](https://reddit.com${post.permalink}) post has been removed by Reddit's Community team.`
        );
      } else {
        options.botMessage = await errorEmbed(
          message,
          `[This](https://reddit.com${post.permalink}) post has been removed. (${post.removed_by_category})`
        );
      }

      if (options.type === "id") {
        return;
      } else if (options.type === "random") {
        return anotherPost(message, options);
      } else {
        return nextPost(message, options);
      }
    }

    if (post.over_18 && !message.channel.nsfw) {
      options.botMessage = await errorEmbed(
        message,
        `[This](https://reddit.com${post.permalink}) is a NSFW post, it can only be shown in NSFW channels.`
      );

      if (options.type === "id") {
        return;
      } else if (options.type === "random") {
        return anotherPost(message, options);
      } else {
        return nextPost(message, options);
      }
    }

    if (
      post.is_self ||
      (post.crosspost_parent_list &&
        post.crosspost_parent_list[0]?.selftext.length > 0)
    ) {
      let postEmbed = new MessageEmbed()
          .setColor(tutuColor)
          .setURL("https://www.reddit.com" + post.permalink)
          .setFooter({
            text: `Requested by ${message.author.tag} ${tutuEmote} | [${post.id}]`,
            iconURL: message.author.avatarURL(),
          }),
        selftext;

      try {
        selftext =
          removeUnwantedText(post.selftext) ||
          removeUnwantedText(post.crosspost_parent_list[0]?.selftext);
      } catch (error) {}

      //Thumbnail
      try {
        postEmbed.setThumbnail(post.preview.images[0].source.url);
      } catch (error) {}

      //Image
      try {
        postEmbed.setImage(
          post.media_metadata[Object.keys(post.media_metadata)[0]].s.u
        );
      } catch (error) {}

      //Title
      try {
        const title = removeMarkdown(post.title);
        if (title.length > 256) {
          postEmbed.setTitle(title.slice(0, 253) + "...");
          if (!selftext) {
            selftext = `...${title.slice(253, title.length)}`;
          } else {
            selftext =
              `...${title.slice(253, title.length)}\n\n---\n\n` + selftext;
          }
        } else {
          postEmbed.setTitle(title);
        }
      } catch (error) {
        console.log(error);
        postEmbed.setTitle("Error getting title");
      }

      //Author
      try {
        let author = `${postStatus(post)}${post.subreddit_name_prefixed} •`;
        if (post.crosspost_parent_list?.length > 0) {
          author += " 🔀 Crossposted";
        }
        author += " by u/" + post.author.name;

        if (
          (!options.subredditIcon && !options.prevListing?.is_self) ||
          options.prevListing?.subreddit.display_name !==
            post.subreddit.display_name
        ) {
          options.subredditIcon = await r.getSubreddit(
            post.subreddit.display_name
          ).community_icon;
        }
        if (
          !options.subredditIcon &&
          post.author.name !== "[deleted]" &&
          options.prevListing?.author.display_name !== post.author.display_name
        ) {
          options.userIcon = await r.getUser(post.author.name).icon_img;
        }
        const authorIcon = options.subredditIcon || options.userIcon;

        postEmbed.setAuthor({ name: author, iconURL: authorIcon });
      } catch (error) {
        console.log(error);
        postEmbed.setAuthor({ name: "Error getting info" });
      }

      //Text
      try {
        let text = "",
          i = 0,
          size = 0;
        const textWords = selftext.split(" ");
        while (i < textWords.length) {
          if (textWords[i].length > 4096) {
            text += textWords[i].slice(0, 4096 - size);
            textWords[i] = textWords[i].slice(4096 - size, textWords[i].length);
            postEmbed.setDescription(text);
            options.botMessage = await message.channel.send({
              embeds: [postEmbed],
            });
            text = "";
            size = 0;
          } else if (size + textWords[i].length + 1 < 4096) {
            text += textWords[i] + " ";
            size += textWords[i].length + 1;
            i++;
          } else {
            postEmbed.setDescription(text);
            options.botMessage = await message.channel.send({
              embeds: [postEmbed],
            });
            text = "";
            size = 0;
          }
          if (i === textWords.length) {
            postEmbed.setDescription(text);
          }
        }
      } catch (error) {}

      //Info
      try {
        postEmbed.addField("Info", postInfo(post));
      } catch (error) {
        console.log(error);
        postEmbed.addField("Info", "Error getting info");
      }

      //Crosspost info
      try {
        let crosspostInfo = `[**${post.crosspost_parent_list[0].title}**](https://www.reddit.com${post.crosspost_parent_list[0].permalink})\n`;
        crosspostInfo += postInfo(post.crosspost_parent_list[0]);
        postEmbed.addField(
          `🔀 ${postStatus(post.crosspost_parent_list[0])}${removeMarkdown(
            post.crosspost_parent_list[0].subreddit_name_prefixed
          )} • by u/${removeMarkdown(
            post.crosspost_parent_list[0].author.name
          )}`,
          crosspostInfo
        );
      } catch (error) {}

      options.botMessage = await message.channel.send({
        embeds: [postEmbed],
      });
    }

    //Non-self posts
    else if (!post.is_self) {
      let postMessage = "";

      //Links
      try {
        if (
          (post.crosspost_parent_list &&
            post.crosspost_parent_list[0]?.is_gallery) ||
          post.is_gallery
        ) {
          getGallery(post).forEach((image) => {
            postMessage += image + "\n";
          });
        } else if (post.media !== null && "reddit_video" in post.media) {
          postMessage += post.media.reddit_video.fallback_url + "\n";
        } else if (post.url.includes("redgifs.com/watch/")) {
          const redgifUrl = await fetch(
            `https://api.redgifs.com/v2/gifs/${
              post.url.split("/")[post.url.split("/").length - 1]
            }`
          ).then((response) => response.json());
          postMessage += `${redgifUrl.gif.urls.sd}\n`;
        } else if (post.url.includes(`/${post.id}/`)) {
          postMessage += "\n";
        } else {
          postMessage += post.url + "\n";
        }
      } catch (error) {
        postMessage += "Failed to get url\n";
        console.log(error);
      }

      try {
        postMessage += "\n" + postStatus(post); //Status
        postMessage += removeMarkdown(post.subreddit_name_prefixed) + " •"; //Subreddit
        if (post.crosspost_parent_list?.length > 0) {
          postMessage += " 🔀 Crossposted"; //Crosspost
        }
        postMessage += ` by u/${removeMarkdown(post.author.name)}`; //Author
        postMessage += `\n**${removeMarkdown(post.title)}**\n`; //Title
        postMessage += postInfo(post); //Info
      } catch (error) {
        console.log(error);
      }

      //Crosspost info
      try {
        const crosspost = post.crosspost_parent_list[0];
        postMessage += `\n\n🔀 ${postStatus(crosspost)}${removeMarkdown(
          crosspost.subreddit_name_prefixed
        )} • by u/${removeMarkdown(crosspost.author.name)}\n*${removeMarkdown(
          crosspost.title
        )}*\n${postInfo(crosspost).split("\n").join(" • ")}`;
      } catch (error) {}

      const authorRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("author")
          .setLabel("Requested by " + message.author.tag)
          .setStyle("SECONDARY")
          .setEmoji(tutuEmote)
          .setDisabled(true)
      );

      const postRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Open on Reddit")
          .setStyle("LINK")
          .setEmoji("874699801256681492") //custom emoji (reddit logo)
          .setURL(`https://reddit.com${post.permalink}`)
      );

      options.botMessage = await message.channel.send({
        content: postMessage,
        components: [authorRow, postRow],
      });
    }

    if (options.type === "id") {
      return;
    } else if (options.type === "random") {
      return anotherPost(message, options);
    } else {
      return nextPost(message, options);
    }
  }

  async function nextPost(message, options) {
    options.botMessage?.react("⏩");
    options.prevListing = options.listing[0];

    if (options.type === "subreddits") {
      options.listing = await options.listing.fetchMore({
        amount: 10,
        append: false,
      });
    } else {
      options.listing = await options.listing.fetchMore({
        amount: 1,
        append: false,
      });
    }

    //Skip pinned post
    if (
      options.type === "hot" &&
      (options.prevListing.stickied || options.prevListing.pinned)
    ) {
      return sendPost(message, options);
    }

    const filter = (reaction, user) => {
      return reaction.emoji.name === "⏩" && user.id === message.author.id;
    };

    const collector = options.botMessage.createReactionCollector({
      filter,
      time: 6000000,
    });

    collector.on("collect", (reaction, user) => {
      options.botMessage.reactions.cache
        .get("⏩")
        .remove()
        .catch((err) => {});
      collector.stop();

      if (options.listing.isFinished) {
        if (options.type === "user") {
          return notifEmbed(
            message,
            "That's all for now!",
            "You saw all the available posts from this user."
          );
        } else if (options.type === "subreddits") {
          return notifEmbed(
            message,
            "That's all for now!",
            "You've reached the end of the popular subreddits listing."
          );
        } else if (options.type === "search") {
          return notifEmbed(
            message,
            "That's all for now!",
            "You've reached the end of the search results."
          );
        } else {
          return notifEmbed(
            message,
            "That's all for now!",
            "You saw all the available posts for this subreddit."
          );
        }
      }
      if (options.type === "subreddits") {
        return popularSubs(message, options);
      }
      sendPost(message, options);
    });

    collector.on("end", (collected) => {
      options.botMessage.reactions.cache
        .get("⏩")
        .remove()
        .catch((err) => {});
    });
  }

  async function anotherPost(message, options) {
    options.botMessage.react("🔄");
    options.prevListing = options.listing;

    options.listing = await r.getRandomSubmission(options.subreddit, {
      skipReplies: true,
    });

    const filter = (reaction, user) => {
      return reaction.emoji.name === "🔄" && user.id === message.author.id;
    };

    const collector = options.botMessage.createReactionCollector({
      filter,
      time: 6000000,
    });

    collector.on("collect", async (reaction, user) => {
      options.botMessage.reactions.cache
        .get("🔄")
        .remove()
        .catch((err) => {});
      collector.stop();
      sendPost(message, options);
    });

    collector.on("end", (collected) => {
      options.botMessage.reactions.cache
        .get("🔄")
        .remove()
        .catch((err) => {});
    });
  }

  async function popularSubs(message, options) {
    const subreddit = options.listing;
    const embed = new MessageEmbed()
      .setTitle("Popular Subreddits")
      .setDescription("The most popular subreddits based on recent activity.")
      .setFooter({
        text: `Requested by ${message.author.tag} ${tutuEmote}`,
        iconURL: message.author.avatarURL(),
      })
      .setColor(tutuColor);

    if (subreddit[0].display_name_prefixed === "r/Home") {
      delete subreddit[0];
    }
    subreddit.forEach(async (subreddit) => {
      try {
        options.rank = options.rank + 1;
        let subDesc;
        if (!(subreddit.public_description.length > 0)) {
          subDesc = "No Description";
        } else {
          subDesc = subreddit.public_description;
        }
        if (subreddit.over18 === true) {
          subreddit.display_name_prefixed =
            subreddit.display_name_prefixed + " 🔞";
        }
        embed.addField(
          `${options.rank}. ${subreddit.display_name_prefixed}`,
          subDesc
        );
      } catch (error) {}
    });

    options.botMessage = await message.channel.send({ embeds: [embed] });
    nextPost(message, options);
  }

  function postStatus(post) {
    let status = "";
    if (post.pinned || post.stickied) {
      status += "📌 ";
    }
    if (post.over_18) {
      status += "🔞 ";
    }
    if (post.archived) {
      status += "🗃️ ";
    }
    if (post.locked) {
      status += "🔒 ";
    }
    return status;
  }

  function postInfo(post) {
    let info = `📅 <t:${post.created}:R>`;
    if (!post.hide_score) {
      info += `\n👍 ${formatNumber(post.ups)} (${
        post.upvote_ratio * 100
      }% upvoted)`;
    }
    info += `\n💬 ${formatNumber(post.num_comments)}`;
    if (post.total_awards_received > 0) {
      info += `\n🏅 ${formatNumber(post.total_awards_received)}`;
    }
    return info;
  }

  function getGallery(post) {
    let gallery = [];
    if (post.crosspost_parent_list) {
      post = post.crosspost_parent_list[0];
    }
    const validPosts = Object.values(post.media_metadata).filter(
      (image) => image.status === "valid"
    );
    for (let x = 0; x < validPosts.length; x++) {
      gallery[x] = `https://i.redd.it/${validPosts[x].id}.${validPosts[x].m
        .split("/")
        .pop()}`;
    }
    return gallery;
  }

  function intro(options) {
    let time, subreddit;
    if (options.time === "hour") {
      time = "the last hour";
    } else if (options.time === "day") {
      time = "the last 24 hours";
    } else if (options.time === "week") {
      time = "the last 7 days";
    } else if (options.time === "month") {
      time = "the last month";
    } else if (options.time === "year") {
      time = "the last 365 days";
    } else if (options.time === "all") {
      time = "all time";
    }
    if (options.subreddit === "all" || options.subreddit === "popular") {
      subreddit = "all subreddits";
    } else {
      subreddit = `r/${options.subreddit}`;
    }
    if (options.type === "top") {
      return `🔝 Getting the top posts of **${subreddit}** from **${time}**...`;
    } else if (options.type === "search") {
      let query;
      if (options.query.length > 100) {
        query = options.query.slice(0, 100) + "...";
      } else {
        query = options.query;
      }
      return `🔍 Searching for **${query}** in **${subreddit}** from posts of **${time}**, sorting by **${options.sort}**...`;
    } else if (options.type === "user") {
      return `👤 Getting the posts of user **u/${options.subreddit}**...`;
    } else if (options.type === "new") {
      return `🌟 Getting the new posts of **${subreddit}**...`;
    } else if (options.type === "hot") {
      return `🔥 Getting the hot posts of **${subreddit}**...`;
    } else if (options.type === "rising") {
      return `📈 Getting the rising posts of **${subreddit}**...`;
    } else if (options.type === "controversial") {
      return `🗡️ Getting the controversial posts of **${subreddit}**...`;
    } else if (options.type === "random") {
      return `🔀 Getting random posts from **${subreddit}**...`;
    } else if (options.type === "id") {
      return `🏷️ Getting the post with ID **${options.subreddit}**...`;
    } else if (options.type === "subreddits") {
      return "📃 Getting the most popular subreddits based on recent activity...";
    }
  }

  function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function removeMarkdown(str) {
    return str
      .replaceAll("*", "\\*")
      .replaceAll("_", "\\_")
      .replaceAll("~", "\\~")
      .replaceAll("|", "\\|");
  }

  function removeUnwantedText(str) {
    return str
      .replaceAll("\n&#x200B;\n", "")
      .replaceAll("&#x200B;\n", "")
      .replaceAll("\n&#x200B;", "")
      .replaceAll("&#x200B;", "");
  }
};
