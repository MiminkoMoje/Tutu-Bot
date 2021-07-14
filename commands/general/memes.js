module.exports = {
    name: 'dankmemes',
    aliases: ['dm', 'meme', 'memes', 'dank', 'funny'],
    description: 'Shows random post of r/dankmemes, r/memes.',
    async execute(message, args) {
        const subreddit = ['memes', 'dankmemes']
        var rType = 'random-predefined-image'
        redditGetPost(args, message, subreddit, rType)
    },
};