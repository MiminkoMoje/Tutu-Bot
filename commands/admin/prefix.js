const { defPrefix } = require(`${require.main.path}/config.json`);
const prefix = require("discord-prefix");
module.exports = {
  name: "prefix",
  description: "Changes prefix",
  permissions: "ADMINISTRATOR",
  async execute(message, args) {
    if (!args[0]) {
      return msgEmbed(
        message,
        "Prefix",
        `The current prefix is \`${
          prefix.getPrefix(message.guild.id) ?? defPrefix
        }\`.\n**prefix [new prefix]** to set a new one.`
      );
    }
    if (
      args[0] === "reset" &&
      defPrefix === prefix.getPrefix(message.guild.id)
    ) {
      return errorEmbed(
        message,
        `\`${defPrefix}\` is already the defined prefix.`
      );
    } else if (args[0] === "reset") {
      await prefix.setPrefix(defPrefix, message.guild.id);
      return msgEmbed(
        message,
        "Prefix reset",
        `The prefix has successfully been reset to \`${defPrefix}\`.`
      );
    }
    if (args[0] === prefix.getPrefix(message.guild.id)) {
      return errorEmbed(
        message,
        `\`${args[0]}\` is already the defined prefix.`
      );
    }
    if (args[0].length > 5) {
      return errorEmbed(
        message,
        "The prefix length should be 5 characters max."
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
