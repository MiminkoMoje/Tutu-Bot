module.exports = {
  name: "search",
  aliases: ["s"],
  description: "Conducts a search.",
  async execute(message, args) {
    let options = {};
    if (!args[0]) {
      const errorMsg = "Please provide a search query.";
      return errorEmbed(message, errorMsg);
    }

    options.query = args.join(" ");
    options.subreddit = "all";
    options.time = "all";
    options.sort = "hot";
    options.type = "search";

    getPost(message, options);
  },
};
