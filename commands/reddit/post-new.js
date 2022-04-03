module.exports = {
  name: "new",
  aliases: ["n"],
  description: "Get the new Reddit posts from your selected subreddit.",
  async execute(message, args) {
    let options = {};
    options.subreddit = args[0];
    options.type = "new";
    getPost(message, options);
  },
};
