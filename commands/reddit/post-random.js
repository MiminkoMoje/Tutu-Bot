module.exports = {
  name: "random",
  aliases: ["r"],
  description: "Shows random Reddit posts from your selected subreddit.",
  async execute(message, args) {
    let options = {};
    options.subreddit = args[0];
    options.type = "random";
    getPost(message, options);
  },
};
