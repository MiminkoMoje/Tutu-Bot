const prefix = require("discord-prefix");
module.exports = {
  name: "prefix",
  description: "Changes prefix",
  permissions: "ADMINISTRATOR",
  async execute(message, args) {
    if (!args[0]) {
      return errorEmbed(message, "Please specify a new prefix.");
    }
    if (args[0] == prefix.getPrefix(message.guild.id)) {
      return errorEmbed(
        message,
        `\`${args[0]}\` is already the defined prefix, obviously...`
      );
    }
    if (args[0].length > 5) {
      return errorEmbed(
        message,
        "The prefix length should be 5 characers max."
      );
    }
    await prefix.setPrefix(args[0], message.guild.id);
    msgEmbed(
      message,
      "Prefix changed",
      `You have successfully changed the prefix to \`${args[0]}\`.`
    );
  },
};
