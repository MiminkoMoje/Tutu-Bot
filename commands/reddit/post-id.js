module.exports = {
  name: "id",
  description: "Gets a Reddit post by its ID.",
  async execute(message, args) {
    let options = {};
    options.subreddit = args[0];
    options.type = "id";
    getPost(message, options);
  },
};
