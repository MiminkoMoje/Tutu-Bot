module.exports = {
    name: 'lesbian',
    aliases: ['lesbians'],
    description: 'Shows random post of r/lesbians or r/Lesbian_gifs.',
    guildOnly: true,
    nsfwDisable: true,
    nsfwCommand: true,
    async execute(message, args) {
        const subreddit = ['lesbians', 'Lesbian_gifs']
        var rType = 'random-predefined-image'
        redditGetPost(args, message, subreddit, rType)
    },
};