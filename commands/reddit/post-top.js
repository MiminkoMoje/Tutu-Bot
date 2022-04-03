module.exports = {
  name: "top",
  aliases: ["t"],
  description: "Shows the top Reddit posts from your selected subreddit.",
  async execute(message, args) {
    let options = {};
    if (!args[0]) {
      const errorMsg = "Please provide a subreddit.";
      return errorEmbed(message, errorMsg);
    } else {
      options.subreddit = args[0];
    }

    if (!args[1]) {
      options.time = "day";
    } else {
      if (["hour", "day", "week", "month", "year", "all"].includes(args[1])) {
        options.time = args[1];
      } else {
        const errorMsg =
          "Please provide a valid timespan.\nAvailable timespans are: **hour, day, week, month, year, all**.\nThis option describes the timespan that posts should be retrieved from.";
        return errorEmbed(message, errorMsg);
      }
    }
    options.type = "top";
    getPost(message, options);
  },
};
