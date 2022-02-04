require(`${require.main.path}/events/embeds.js`)();
module.exports = {
  name: "search",
  aliases: ["s", "find"],
  description: "Conducts a search.",
  async execute(message, args) {

    if (!args[0]) {
      const errorMsg = `Please provide a search query.`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }

    //delete args[0];
    var query = args.join(" ");
    var rType = "search";

    redditGetPost(
      args,
      message,
      (subreddit = "all"),
      rType,
      (time = "all"),
      query,
      (sort = "hot")
    );
  },
};
