module.exports = {
  name: "user",
  aliases: ["u", "redditor"],
  description: "Shows posts of a user.",
  async execute(message, args) {
    let options = {};
    options.subreddit = args[0];
    options.type = "user";
    getPost(message, options);
  },
};
