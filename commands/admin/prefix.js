require(`${require.main.path}/events/embeds.js`)();
const prefix = require("discord-prefix");
module.exports = {
  name: "prefix",
  description: "Changes prefix",
  permissions: "ADMINISTRATOR",
  async execute(message, args) {
    if (!args[0]) {
      const errorMsg = `Please specify a new prefix.`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }
    if (args[0] == prefix.getPrefix(message.guild.id)) {
      const errorMsg = `\`${args[0]}\` is already the defined prefix, obviously...`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }
    if (args[0].length > 5) {
      const errorMsg = `The prefix length should be 5 characers max.`;
      return errorEmbed(
        message,
        errorMsg,
        message.author.avatarURL(),
        message.author.tag
      );
    }
    await prefix.setPrefix(args[0], message.guild.id);
    const embedTitle = "Prefix changed";
    const embedMsg = `You have successfully changed the prefix to \`${args[0]}\`.`;
    msgEmbed(message, embedTitle, embedMsg);
  },
};
