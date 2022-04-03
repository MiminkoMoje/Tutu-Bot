module.exports = function () {
  this.errorEmbed = function (message, errorMsg) {
    const embed = {
      title: "Error",
      description: errorMsg,
      color: errorColor,
      footer: {
        icon_url: message.author.avatarURL(),
        text: message.author.tag,
      },
    };
    if (typeof message === "number") {
      return message.client.channels.cache.get(message).send({ embeds: [embed] });
    } else {
      return message.channel.send({ embeds: [embed] });
    }
  };

  this.customErrorEmbed = function (message, errorTitle, errorMsg) {
    const embed = {
      title: errorTitle,
      description: errorMsg,
      color: errorColor,
      footer: {
        icon_url: message.author.avatarURL(),
        text: message.author.tag,
      },
    };
    if (typeof message === "number") {
      return message.client.channels.cache.get(message).send({ embeds: [embed] });
    } else {
      return message.channel.send({ embeds: [embed] });
    }
  }

  this.msgEmbed = function (message, embedTitle, embedMsg) {
    const embed = {
      title: embedTitle,
      description: embedMsg,
      color: tutuColor,
      footer: {
        icon_url: message.author.avatarURL(),
        text: `Requested by ${message.author.tag}`,
      },
    };
    if (typeof message === "number") {
      message.client.channels.cache.get(message).send({ embeds: [embed] });
    } else {
      message.channel.send({ embeds: [embed] });
    }
  };

  this.notifEmbed = function (message, embedTitle, embedMsg) {
    const embed = {
      title: embedTitle,
      description: embedMsg,
      color: tutuColor,
      footer: {
        icon_url: message.author.avatarURL(),
        text: message.author.tag,
      },
    };
    if (typeof message === "number") {
      message.client.channels.cache.get(message).send({ embeds: [embed] });
    } else {
      message.channel.send({ embeds: [embed] });
    }
  };

  this.errorNoResults = function (message) {
    const embed = {
      title: "Error",
      description: "No results found.",
      color: errorColor,
      footer: {
        icon_url: message.author.avatarURL(),
        text: message.author.tag,
      },
    };
    if (typeof message === "number") {
      message.client.channels.cache.get(message).send({ embeds: [embed] });
    } else {
      message.channel.send({ embeds: [embed] });
    }
  };
};
