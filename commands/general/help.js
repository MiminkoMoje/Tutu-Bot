const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["commands", "command", "reddit"],
  description: "Shows the available commands.",
  execute(message) {
    const helpEmbed = new MessageEmbed()
      .setColor(tutuColor)
      .setTitle("Commands")
      .setFooter({
        text: `Requested by ${message.author.tag} ${tutuEmote} | by Vasilis#1517`,
        iconURL: message.author.avatarURL(),
      })
      .addFields(
        {
          name: `help`,
          value:
            "This command eliminates racism and brings you good luck for 8.2 years",
        },
        {
          name: `top [subreddit] (timespan)`,
          value:
            "Shows the top posts of a subreddit\nAvailable timespans are: **hour, day, week, month, year, all**",
        },
        {
          name: `new [subreddit]`,
          value: "For the brave ones who like sorting by new",
        },
        { name: `user [a Reddit user]`, value: "Shows posts of a Reddit user" },
        {
          name: `random [subreddit]`,
          value: "Shows a random submission from a subreddit",
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
          value: "Shows the most popular subreddits, based on recent activity",
        },
        {
          name: `urban [term]`,
          value: "Shows the definition of any term using Urban Dictionary 😳",
        }
      );
    message.channel.send({ embeds: [helpEmbed] });
  },
};
