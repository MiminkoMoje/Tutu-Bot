module.exports = {
  name: "subreddits",
  aliases: ["popular", "subreddit", "sub", "subs"],
  async execute(message) {
    let options = {};
    options.rank = 0;
    options.type = "subreddits";
    options.subreddit = "all";
    getPost(message, options);
  },
};
