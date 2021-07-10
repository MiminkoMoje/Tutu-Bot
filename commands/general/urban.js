const fetch = require('node-fetch');
const querystring = require('querystring');
const Discord = require('discord.js');
require(`${require.main.path}/events/embeds.js`)();

module.exports = {
  name: 'urban',
  aliases: ['ud', 'uds', 'urbandictionary', 'urban-dictionary', 'udict', 'udictionary', 'urband', 'urbandict'],
  description: 'Shows the Urban Definition of your query.',

  //first version: May/June 2020

  //start
  async execute(message, args) {

    //function that checks if a value is a number
    function isNumeric(value) {
      return /^-?\d+$/.test(value);
    };

    //stop here and show error if user didn't include any query
    if (!args.length) {
      const errorMsg = `You need to supply a search term.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    var i = 0 //in case user didn't include a result number with their query, we pre define it here (0 = 1st result)

    //check if user included a result number before their query
    if (isNumeric(args[0]) === true && args[1]) { //if 1st arg is a number and 2nd arg exists
      if (args[0] >= 1 && args[0] <= 10) { //if 1st arg is a num between 1 and 10
        var i = args[0] - 1
        delete args[0] //we delete the result number and we only keep the query
      } else {
        const errorMsg = `Only numbers from 1 to 10 are allowed.`
        return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag) //for some reason the api only fetches 10 results. fuck that.
      }
    }

    //connect the args with spaces and use urban dictionary api to search the query. show error if not found
    var query = querystring.stringify({ term: args.join(' ') }).trimStart();
    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
    try {
      if (!list.length) {
        return errorNoResults(message, message.author.avatarURL(), message.author.tag)
      }
    } catch (error) {
      const errorMsg = `There is an error with this definition. Sorry for the inconvience.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    //sort by likes
    function compare(a, b) {
      if (a.thumbs_up > b.thumbs_up) {
        return -1;
      }
      if (a.thumbs_up < b.thumbs_up) {
        return 1;
      }
      return 0;
    }
    list.sort(compare);

    //sort by query
    var xi = 0
    for (var x = 0; x < list.length; x++) {
      if (args.join(' ').trimStart() === list[x].word.toLowerCase()) {
        var element = list[x];
        list.splice(x, 1);
        list.splice(xi, 0, element);
        xi = xi + 1
      }
    }

    //uEnd is used for an error message below
    var uEnd
    if (i + 1 === 1) {
      uEnd = 'st' //u never know
    } else if (i + 1 === 2) {
      uEnd = 'nd'
    } else if (i + 1 === 3) {
      uEnd = 'rd'
    } else {
      uEnd = 'th'
    }

    //if user included a result number but there is no such result, show error. uEnd is used. otherwise put definition in uResult
    try {
      var uResult = list[i].definition
    } catch (err) {
      const errorMsg = `There is no ${i + 1}${uEnd} definition of *${args.join(' ').trimStart()}*.`
      return errorEmbed(message, errorMsg, message.author.avatarURL(), message.author.tag)
    }

    //check if example exists. rare case but it happens
    if (list[i].example !== "") {
      var uExample = list[i].example
    }
    else { var uExample = "" }

    //put everything in variables
    var uTerm = list[i].word //the word as it is stored in urban dict.
    var uUrl = list[i].permalink //link of the definition, we use it in embed so the user has the option to click the title and visit it
    var uAuthor = list[i].author //the author of the definition
    var uDate = list[i].written_on.substring(0, 10) //the date, its very messy, so we only take a section of it and we change it below
    var uLikes = list[i].thumbs_up //the likes of the definition (left by other users on urban dict.)
    var uDislikes = list[i].thumbs_down //and the dislikes
    uResult = uResult.replace(/[\[\]']+/g, '');
    uExample = uExample.replace(/[\[\]']+/g, '');

    //the date variable is a mess, so we make it beautiful
    var uMonth
    if (uDate.substring(5, 7) === '01') {
      uMonth = 'January'
    } else if (uDate.substring(5, 7) === '02') {
      uMonth = 'February'
    } else if (uDate.substring(5, 7) === '03') {
      uMonth = 'March'
    } else if (uDate.substring(5, 7) === '04') {
      uMonth = 'April'
    } else if (uDate.substring(5, 7) === '05') {
      uMonth = 'May'
    } else if (uDate.substring(5, 7) === '06') {
      uMonth = 'June'
    } else if (uDate.substring(5, 7) === '07') {
      uMonth = 'July'
    } else if (uDate.substring(5, 7) === '08') {
      uMonth = 'August'
    } else if (uDate.substring(5, 7) === '09') {
      uMonth = 'September'
    } else if (uDate.substring(5, 7) === '10') {
      uMonth = 'October'
    } else if (uDate.substring(5, 7) === '11') {
      uMonth = 'November'
    } else if (uDate.substring(5, 7) === '12') {
      uMonth = 'December'
    }
    var uFullDate = `${uMonth} ${uDate.substring(8, 10)}, ${uDate.substring(0, 4)}` //we put beautiful date in a var

    var uResultArray = []
    var uExampleArray = []

    var y

    var uResLenght = uResult.length / 1020;
    for (y = 0; y < uResLenght; y++) {
      uResultArray[y] = uResult.slice(1020 * y, (1020 * y) + 1020);
    }

    var uExLenght = uExample.length / 1020;
    for (y = 0; y < uExLenght; y++) {
      uExampleArray[y] = uExample.slice(1020 * y, (1020 * y) + 1020);
    }

    var resultEmbed = new Discord.MessageEmbed()
      .setColor(tutuColor)
      .setTitle(uTerm)
      .setURL(uUrl)
      .setFooter(`Requested by ${message.author.tag} 💜 | ${i + 1}/${list.length}`, message.author.avatarURL())

    y = 0
    while (uResLenght > 0 || uExLenght > 0) {

      if (y > 0) {
        var uResTitle = `Definition (part ${y + 1})`
        var uExTitle = `Example (part ${y + 1})`
      } else {
        var uResTitle = `Definition`
        var uExTitle = `Example`
      }

      if (uResLenght > 0) {
        resultEmbed.addField(uResTitle, uResultArray[y])
        uResLenght = uResLenght - 1
      }

      if (uExLenght > 0) {
        resultEmbed.addField(uExTitle, uExampleArray[y])
        uExLenght = uExLenght - 1
      }

      if (y === 0) {
        resultEmbed.addField('Info', `By ${uAuthor} on ${uFullDate}\n👍${uLikes} | 👎${uDislikes}`)
      }

      y++

      message.channel.send(resultEmbed);
      resultEmbed.fields = [];
    }
  },
};