const { serverLogId, serverLogIdDM } = require(`${require.main.path}/config.json`);
module.exports = {
	name: 'message',
	execute(message, client) {
		let ignoreId = [ //user ids that the bot should ignore
			'241929388403195914',
			'705043523279388723',
			'822554692578967602'
		]
		if (ignoreId.includes(message.author.id)) return;
		
		if (message.guild === null && !message.author.bot) {
			client.channels.cache.get(serverLogIdDM).send(`**${message.author.tag}** DMed: ${message.content}`);
		} else if (!message.author.bot) {
			client.channels.cache.get(serverLogId).send(`**${message.author.tag}** in **#${message.channel.name}** sent: ${message.content}`);
		}
	},
};