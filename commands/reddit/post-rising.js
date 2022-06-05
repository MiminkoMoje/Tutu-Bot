module.exports = {
  name: "rising",
  aliases: ["ris", "rise"],
  description: "Get the rising Reddit posts from your selected subreddit.",
  async execute(message, args) {
    let options = {};
    options.subreddit = args[0];
    options.type = "rising";
    getPost(message, options);
  },
};
