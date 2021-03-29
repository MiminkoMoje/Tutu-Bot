module.exports = function () {
    this.nsfwCommand = function (message, author, post, title, rAuthor, subreddit) {
        message.channel.send(`Tutu well, **${author}** 💜\n${post}\n**${title}**\n*by ${rAuthor} in ${subreddit}*`)
    };
}
