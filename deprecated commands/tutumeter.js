module.exports = {
    name: 'tutumeter',
    aliases: ['tutu', 'tm'],
    description: 'Love meter between you and your selected user. Unfinished (and no plans for finishing for now).',
    guildOnly: true,
    execute(message, args) {
        if (!args[0]) {
            message.channel.send('You need to mention a user (`,tutumeter @...`).');
        } else {
            if (message.mentions.members.first()) {
                const love = Math.floor(Math.random() * 101)
                var loveUser = message.mentions.members.first();
                message.channel.send(`Command work in progress\n<@${message.author.id}> & <@${loveUser.user.id}> ${love}%`);
            } else {
                message.channel.send(`**${args[0]}** doesn't seem to be a mention. It must be a user mention.`)
            }
        }
    },
};