module.exports = {
  name: "ping",
  description: "Ping! (test command)",
  permissions: "ADMINISTRATOR",
  execute(message) {
    message.channel.send("Pong.");
  },
};
