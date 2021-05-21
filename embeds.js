const { prefix, token, ownerId } = require(`${require.main.path}/config.json`);

module.exports = function () {
    this.errorEmbed = function (message, errorMsg, avatarURL, authorTag) {
        const embed = {
            "title": `Error`,
            "description": errorMsg,
            "color": errorColor,
            "footer": {
                "icon_url": avatarURL,
                "text": authorTag,
            },
        };
        message.channel.send({ embed: embed })
    };

    this.errorGuildOnly = function (message, avatarURL, authorTag) {
        const embed = {
            "title": `Error`,
            "description": `This command can't be used in DMs.`,
            "color": errorColor,
            "footer": {
                "icon_url": avatarURL,
                "text": authorTag,
            },
        };
        message.channel.send({ embed: embed })
    };

    this.errorNoResults = function (message, avatarURL, authorTag) {
        const embed = {
            "title": `Error`,
            "description": `No results found.`,
            "color": errorColor,
            "footer": {
                "icon_url": avatarURL,
                "text": authorTag,
            },
        };
        message.channel.send({ embed: embed })
    };

    this.error503Reddit = function (message, avatarURL, authorTag) {
        const embed = {
            "title": `Error 503`,
            "description": `Reddit servers are unavailable right now, please try again.`,
            "color": errorColor,
            "footer": {
                "icon_url": avatarURL,
                "text": authorTag,
            },
        };
        message.channel.send({ embed: embed })
    };

    this.error503Reddit = function (message, avatarURL, authorTag) {
        const embed = {
            "title": `Error 503`,
            "description": `Reddit servers are unavailable right now, please try again.`,
            "color": errorColor,
            "footer": {
                "icon_url": avatarURL,
                "text": authorTag,
            },
        };
        message.channel.send({ embed: embed })
    };
}