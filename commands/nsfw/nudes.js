module.exports = {
    name: 'nudes',
    aliases: ['nude', 'realgirls', 'legalteens', 'collegesluts'],
    description: 'Shows random post of r/Nude_Selfie, r/RealGirls, r/LegalTeens or r/collegesluts.',
    guildOnly: true,
    nsfwDisable: true,
    nsfwCommand: true,
    async execute(message, args) {
        const subreddit = [
            'Nude_Selfie',
            'RealGirls',
            'LegalTeens',
            'collegesluts']
        var rType = 'random-predefined-image'
        redditGetPost(args, message, subreddit, rType)
    },
};