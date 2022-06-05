const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["commands", "command", "reddit"],
  description: "Shows the available commands.",
  execute(message, args) {
    const helpEmbed = new MessageEmbed()
      .setColor(tutuColor)
      .setTitle("Commands")
      .setFooter({
        text: `Requested by ${message.author.tag} ${tutuEmote} | by Vasilis#1517`,
        iconURL: message.author.avatarURL(),
      });

    if (args[0] === "admin") {
      helpEmbed.addFields({
        name: `prefix [new prefix]/reset`,
        value: "Changes the bot prefix for this server",
      });
    } else {
      helpEmbed.addFields(
        {
          name: `help admin`,
          value: "Shows the available admin commands",
        },
        {
          name: `hot [subreddit]`,
          value: "Shows the hot posts of a subreddit",
        },
        {
          name: `new [subreddit]`,
          value: "For the brave ones who like sorting by new",
        },
        {
          name: `top [subreddit] (timespan)`,
          value:
            "Shows the top posts of a subreddit\nAvailable timespans are: **hour, day, week, month, year, all**",
        },
        {
          name: `controversial [subreddit]`,
          value: "Shows the controversial posts of a subreddit",
        },
        {
          name: `rising [subreddit]`,
          value: "Shows the rising posts of a subreddit",
        },
        { name: `user [a Reddit user]`, value: "Shows posts of a Reddit user" },
        {
          name: `random [subreddit]`,
          value: "Shows random submissions from a subreddit",
        },
        { name: `id [a Reddit post ID]`, value: "Gets a post from its ID" },
        {
          name: `search [query]`,
          value: "Conducts a search and sorts by hot",
        },
        {
          name: `asearch`,
          value:
            "Stands for advanced search. Allows you to select the timespan and sorting of the search results. Execute the command for more info",
        },
        {
          name: `subreddits`,
          value:
            "Shows the most popular subreddits, based on their recent activity",
        },
        {
          name: `urban [term]`,
          value: "Shows the definition of any term using Urban Dictionary 😳",
        }
      );
    }
    message.channel.send({ embeds: [helpEmbed] });
  },
};
