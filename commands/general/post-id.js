module.exports = {
  name: "id",
  description: "Gets a Reddit post by its ID.",
  async execute(message, args) {
    const subreddit = args[0];
    var rType = "id";
    redditGetPost(args, message, subreddit, rType);
  },
};
