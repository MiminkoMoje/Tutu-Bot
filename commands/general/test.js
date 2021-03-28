module.exports = {
	name: 'test',
	description: 'Test command',
	execute(message) {
		message.channel.send('test');
	},
};