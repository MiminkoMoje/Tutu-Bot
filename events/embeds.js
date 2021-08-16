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
    message.channel.send({ embeds: [embed] })
  };

  this.msgEmbed = function (message, embedTitle, embedMsg) {
    const embed = {
      "title": embedTitle,
      "description": embedMsg,
      "color": tutuColor,
      "footer": {
        "icon_url": message.author.avatarURL(),
        "text": message.author.tag,
      },
    };
    message.channel.send({ embeds: [embed] })
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
    message.channel.send({ embeds: [embed] })
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
    message.channel.send({ embeds: [embed] })
  };

  this.errorNsfwDisabled = function (message, avatarURL, authorTag) {
    const embed = {
      "title": `Error`,
      "description": `The NSFW commands are disabled for this server.`,
      "color": errorColor,
      "footer": {
        "icon_url": avatarURL,
        "text": authorTag,
      },
    };
    message.channel.send({ embeds: [embed] })
  };
}