module.exports = {
  name: "asearch",
  aliases: ["as", "advanced"],
  description: "Conducts an advanced search.",
  async execute(message, args) {
    let options = {};

    if (args[0]) {
      options.subreddit = args[0];
    } else {
      return msgEmbed(
        message,
        "Advanced Search",
        "With advanced search, you can select the timespan that posts should be retrieved from, and the sorting option that determines how the results should be sorted.\n\nSyntax: **asearch [subreddit] [timespan] [sort] [query]**.\n\nAvailable timespans are: **hour, day, week, month, year, all**.\nAvailable sorting options are: **relevance, hot, top, new, comments**.\n\nThe normal **search** command searches all posts and sorts them by hot."
      );
    }

    if (["hour", "day", "week", "month", "year", "all"].includes(args[1])) {
      options.time = args[1];
    } else {
      return errorEmbed(
        message,
        "Please provide a valid timespan.\nAvailable timespans are: **hour, day, week, month, year, all**.\nThis option describes the timespan that posts should be retrieved from.\n\nRemember, the correct syntax is: **asearch [subreddit] [timespan] [sort] [query]**."
      );
    }

    if (["relevance", "hot", "top", "new", "comments"].includes(args[2])) {
      options.sort = args[2];
    } else {
      return errorEmbed(
        message,
        "Please provide a valid sorting option.\nAvailable sorting options are: **relevance, hot, top, new, comments**.\nThis option determines how the results should be sorted.\n\nRemember, the correct syntax is: **asearch [subreddit] [timespan] [sort] [query]**."
      );
    }

    if (!args[3]) {
      return errorEmbed(
        message,
        "Please provide a search query.\n\nRemember, the correct syntax is: **asearch [subreddit] [timespan] [sort] [query]**."
      );
    }

    delete args[0];
    delete args[1];
    delete args[2];
    options.query = args.join(" ").substring(3);
    options.type = "search";

    getPost(message, options);
  },
};
