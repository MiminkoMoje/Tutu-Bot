require(`${require.main.path}/commands/general/reddit.js`)();
module.exports = {
    name: 'turtle',
    aliases: ['turtles'],
    description: 'Shows a random Reddit post from your selected subreddit.',
    //guildOnly: true,
    async execute(message, args) {
        const subreddits = ['turtle', 'turtles']
        const subreddit = Math.floor(Math.random() * subreddits.length);
        var rType = 'random-predefined-image'
        redditGetPost(args, message, subreddits[subreddit], rType)
    }
}