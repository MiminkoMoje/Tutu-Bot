module.exports = {
  name: "controversial",
  aliases: ["c", "controversy", "contr"],
  description: "Get the controversial Reddit posts from your selected subreddit.",
  async execute(message, args) {
    let options = {};
    options.subreddit = args[0];
    options.type = "controversial";
    getPost(message, options);
  },
};
