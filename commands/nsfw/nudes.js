module.exports = {
  name: 'nudes',
  aliases: ['nude', 'realgirls', 'legalteens', 'collegesluts', 'nude_selfie'],
  description: 'Shows random post of r/Nude_Selfie, r/RealGirls, r/LegalTeens or r/collegesluts.',
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