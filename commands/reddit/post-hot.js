module.exports = {
  name: "hot",
  aliases: ["h"],
  description: "Get the hot Reddit posts from your selected subreddit.",
  async execute(message, args) {
    let options = {};
    options.subreddit = args[0];
    options.type = "hot";
    getPost(message, options);
  },
};
