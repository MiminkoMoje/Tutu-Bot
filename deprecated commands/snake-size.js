module.exports = {
	name: 'pp',
	aliases: ['snake', 'dick', 'penis', 'snake', 'sneik', 'cock'],
	description: 'Exposes your or your friends\' penis size.',
	guildOnly: true,
	execute(message, args) {
		const size = Math.floor(Math.random() * 15) + 1
    const rare_size = Math.floor(Math.random() * 100) + 1
    var penis = '='
    if (!args[0]) {
      if (rare_size === 69) {
        message.channel.send(`<@${message.author.id}> doesn't have a penis.`);
      } else {
        message.channel.send(`<@${message.author.id}>\'s penis size\n**8${penis.repeat(size)}D**`);
      }
    } else if (message.mentions.members.first()) {
      var ppUser = message.mentions.members.first();
      if (rare_size === 69) {
        message.channel.send(`<@${ppUser.user.id}> doesn't have a penis.`);
      } else {
        message.channel.send(`<@${ppUser.user.id}>\'s penis size\n**8${penis.repeat(size)}D**`);
      }
    } else {
      message.channel.send(`**${args[0]}** doesn't seem to be a mention. It must be a user mention.`)
    }
	},
};