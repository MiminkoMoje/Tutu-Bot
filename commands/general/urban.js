const fetch = require('node-fetch');
const querystring = require('querystring');

  //TODO: create a favorite feature so the user can save fav definitions
  //maybe create a ,next command so the user can see the next result without having to retype the whole command again

module.exports = {
  name: 'urban',
  aliases: ['ud', 'disctionary', 'uds', 'urban-disctionary', 'definition'],
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
      const noTermErrorMsg = {
        "title": `Error`,
        "description": `You need to supply a search term.`,
        "color": 8340223,
        "footer": {
          "icon_url": message.author.avatarURL(),
          "text": `${message.author.tag}`,
        },
      };
      return message.channel.send({ embed: noTermErrorMsg });
    }

    var i = 0 //in case user didn't include a result number with their query, we pre define it here (0 = 1st result)

    //check if user included a result number before their query
    if (isNumeric(args[0]) === true && args[1]) { //if 1st arg is a number and 2nd arg exists
      if (args[0] >= 1 && args[0] <= 10) { //if 1st arg is a num between 1 and 10
        var i = args[0] - 1
        delete args[0] //we delete the result number and we only keep the query
      } else {
        const numErrorMsg = {
          "title": `Error`,
          "description": `Only numbers from 1 to 10 are allowed.`,
          "color": 8340223,
          "footer": {
            "icon_url": message.author.avatarURL(),
            "text": `${message.author.tag}`,
          },
        };
        return message.channel.send({ embed: numErrorMsg });//for some reason the api only fetches 10 results. fuck that.
      }
    }

    //connect the args with spaces and use urban dictionary api to search the query. show error if not found
    var query = querystring.stringify({ term: args.join(' ') }).trimStart();
    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
    if (!list.length) {
      const noResErrorMsg = {
        "title": `Error`,
        "description": `No results found for *${args.join(' ').trimStart()}*.`,
        "color": 8340223,
        "footer": {
          "icon_url": message.author.avatarURL(),
          "text": `${message.author.tag}`,
        },
      };
      return message.channel.send({ embed: noResErrorMsg });
    }

    //uEnd is used for an error message below
    if (i + 1 === 1) {
      var uEnd = 'st' //u never know
    } else if (i + 1 === 2) {
      var uEnd = 'nd'
    } else if (i + 1 === 3) {
      var uEnd = 'rd'
    } else {
      var uEnd = 'th'
    }

    //if user included a result number but there is no such result, show error. uEnd is used. otherwise put definition in uResult
    try {
      var uResult = list[i].definition
    } catch (err) {
      const noResNumErrorMsg = {
        "title": `Error`,
        "description": `There is no ${i + 1}${uEnd} definition of *${args.join(' ').trimStart()}*.`,
        "color": 8340223,
        "footer": {
          "icon_url": message.author.avatarURL(),
          "text": `${message.author.tag}`,
        },
      };
      return message.channel.send({ embed: noResNumErrorMsg });
    }

    //check if example exists. rare case but it happens
    if (list[i].example !== "") {
      var uExample = list[i].example
    }
    else { var uExample = "No example." } //so if there is no example, it shows this in the example field 

    //put everything in variables
    var uTerm = list[i].word //the word as it is stored in urban dict.
    var uUrl = list[i].permalink //link of the definition, we use it in embed so the user has the option to click the title and visit it
    var uAuthor = list[i].author //the author of the definition
    var uDate = list[i].written_on.substring(0, 10) //the date, its very messy, so we only take a section of it and we change it below
    var uLikes = list[i].thumbs_up //the likes of the definition (left by other users on urban dict.)
    var uDislikes = list[i].thumbs_down //and the dislikes

    //the date variable is a mess, so we make it beautiful
    if (uDate.substring(5, 7) === '01') {
      var uMonth = 'January'
    } else if (uDate.substring(5, 7) === '02') {
      var uMonth = 'February'
    } else if (uDate.substring(5, 7) === '03') {
      var uMonth = 'March'
    } else if (uDate.substring(5, 7) === '04') {
      var uMonth = 'April'
    } else if (uDate.substring(5, 7) === '05') {
      var uMonth = 'May'
    } else if (uDate.substring(5, 7) === '06') {
      var uMonth = 'June'
    } else if (uDate.substring(5, 7) === '07') {
      var uMonth = 'July'
    } else if (uDate.substring(5, 7) === '08') {
      var uMonth = 'August'
    } else if (uDate.substring(5, 7) === '09') {
      var uMonth = 'September'
    } else if (uDate.substring(5, 7) === '10') {
      var uMonth = 'October'
    } else if (uDate.substring(5, 7) === '11') {
      var uMonth = 'November'
    } else if (uDate.substring(5, 7) === '12') {
      var uMonth = 'December'
    }
    var uFullDate = `${uMonth} ${uDate.substring(8, 10)}, ${uDate.substring(0, 4)}` //we put beautiful date in a var

    //max chars in an embed field is 1024. cut every result that is above that so we can use the rest of it in another embed
    //note: there's probably a much better way to do that. my code is shit. sorry.
    if (uResult.length > 1020) {
      var uResult1 = uResult.substring(0, 1020)
      var uResult2 = uResult.substring(1020, uResult.length)
    } else { var uResult1 = uResult }

    //same for the example
    if (uExample.length > 1020) {
      var uExample1 = uExample.substring(0, 1020)
      var uExample2 = uExample.substring(1020, uExample.length)
    } else { var uExample1 = uExample }

    //main embed
    const embed = {
      "title": uTerm,
      "url": uUrl, //clicking the url goes to the definition in urban dict.
      "color": 8340223, //tutu purple
      "footer": {
        "icon_url": message.author.avatarURL(),
        "text": `Requested by ${message.author.tag} 💜 | ${i + 1}/10`, //number of the result that is appearing out of 10 potential results
      },
      "fields": [
        {
          "name": "Definition",
          "value": uResult1.replace(/[\[\]']+/g, '') //the replace is because some words and sentences have []. we remove those
        },
        {
          "name": "Example",
          "value": uExample1.replace(/[\[\]']+/g, '')
        },
        {
          "name": "Info",
          "value": `By ${uAuthor} on ${uFullDate}\n👍${uLikes} | 👎${uDislikes}`
        },
      ]
    };
    message.channel.send({ embed });

    //if both result and example were big, we put the rest in this embed after we cut them above
    //as i said above, this is a shit way to do that. hopefully i (or u) will manage to make a better way some day.
    if (uResult.length > 1020 && uExample.length > 1020) {
      const embed4 = {
        "title": uTerm,
        "url": uUrl,
        "color": 8340223,
        "footer": {
          "icon_url": message.author.avatarURL(),
          "text": `Requested by ${message.author.tag} 💜 | ${i + 1}/10`,
        },
        "fields": [
          {
            "name": "Definition (part 2)",
            "value": uResult2.replace(/[\[\]']+/g, '')
          },
          {
            "name": "Example (part 2)",
            "value": uExample2.replace(/[\[\]']+/g, '')
          },
        ]
      };
      message.channel.send({ embed: embed4 });
    }

    //if only result was too big
    if (uResult.length > 1020) {
      const embed2 = {
        "title": uTerm,
        "url": uUrl,
        "color": 8340223,
        "footer": {
          "icon_url": message.author.avatarURL(),
          "text": `Requested by ${message.author.tag} 💜 | ${i + 1}/10`,
        },
        "fields": [
          {
            "name": "Definition (part 2)",
            "value": `...${uResult2.replace(/[\[\]']+/g, '')}`
          },
        ]
      };
      message.channel.send({ embed: embed2 });
    }

    //and if only example was too big
    if (uExample.length > 1020) {
      const embed3 = {
        "title": uTerm,
        "url": uUrl,
        "color": 8340223,
        "footer": {
          "icon_url": message.author.avatarURL(),
          "text": `Requested by ${message.author.tag} 💜 | ${i + 1}/10`,
        },
        "fields": [
          {
            "name": "Example (part 2)",
            "value": `...${uExample2.replace(/[\[\]']+/g, '')}`
          },
        ]
      };
      message.channel.send({ embed: embed3 });
    }
  },
};