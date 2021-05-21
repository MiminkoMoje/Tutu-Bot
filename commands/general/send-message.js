require(`${require.main.path}/events/embeds.js`)();
module.exports = {
    name: 'msg',
    description: 'Send message to any channel',
    permissions: 'ADMINISTRATOR',
    execute(message, args) {
        var chMsg = message.content.split(args[0]).join('');
        try {
            message.client.channels.cache.get(args[0]).send(chMsg.replace(/,msg /i, ""));
        } catch (error) {
            const errorMsg = `An error occured. Make sure the command syntax is correct:\n,msg [channel ID] [message]`
            return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
        }
    },
};