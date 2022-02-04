module.exports = {
  name: "new",
  aliases: ["n"],
  description: "Get the new Reddit posts from your selected subreddit.",
  async execute(message, args) {
    const subreddit = args[0];
    var rType = "new";
    redditGetPost(args, message, subreddit, rType);
  },
};
