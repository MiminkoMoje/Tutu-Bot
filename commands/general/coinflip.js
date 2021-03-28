module.exports = {
    name: 'coinflip',
    aliases: ['cf', 'coin'],
    description: 'Flips a coin.',
    execute(message) {
        const coin_mark = Math.floor(Math.random() * 2) + 1
        const rare_coin_mark = Math.floor(Math.random() * 200) + 1
        if (rare_coin_mark === 18) {
            var coin = '**YOOO THE COIN BROKE IN HALF WTF????**'
        } else if (coin_mark === 1) {
            var coin = '**HEADS**'
        } else {
            var coin = '**TAILS**'
        }
        const cf1 = {
            "title": `Coinflip`,
            "description": `<a:coinflip:814472899053617222>`, //emoji: coin spinning
            "color": 8340223,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} 💜`,
            },
          };
          const cf2 = {
            "title": `Coinflip`,
            "description": `<:coin:822095847050969118> ` + coin, //emoji: coin
            "color": 8340223,
            "footer": {
                "icon_url": message.author.avatarURL(),
                "text": `Requested by ${message.author.tag} 💜`,
            },
          };

        message.channel.send({embed:cf1}).then(message => {
            setTimeout(function () {
                message.edit({embed:cf2});
            }, 900);
        })
    },
};