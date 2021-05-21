# Tutu Bot

Poorly-coded bot intended to be used in my and my friends' servers.

Urban Dictionary term look-up,  
Memes from Reddit,  
NSFW commands,  
plus other goofy but also very useless commands.  

Add the Tutu Bot to your Discord server by visiting my [Tutu Bot Website](https://imvasi.com/tutu). Keep in mind that the bot isn't always running. If you want to host the bot by yourself, make changes or contribute, read below.

## Installation

If you want to see how useless this bot is by yourself, you can clone this repo:
```
git clone https://github.com/MiminkoMoje/TutuBot.git
```
After cloning, run
```
npm install
```
to install the required dependencies. Obviously, you need [node](https://nodejs.org/en/) installed.

## Set up

Rename the `rename_me.json` file to `config.json`.  
Now, open it and fill out the required information:  
`token`: Your token  
`ownerID`: Your user ID  

`redditCredentials`:  
This bot uses Reddit for some commands and most of the NSFW ones. In order to set up Reddit for the bot:  
-Proceed to [Authorized applications](https://reddit.com/prefs/apps/)  
-Press the "Create an app" button  
-Enter your application's name, its description and about and redirect uris  
-Choose "script" in the list - that's important  
-Press the "Create app" button  

You will get the app's ID under the "personal use script" line and app's secret hash.  
So now, in `config.json`, you can fill the required Reddit information.  

Run `index.js` to give life to the bot.  

Note: the `coinflip` command uses custom emotes. You can find them in the `custom emotes` folder but you will have to se them up by yourself in `coinflip.js`.

## Can/Should I contribute?

PLEASE feel free to. I'd love to see how my code can be improved and would totally help me learn for the future. Or if you have any ideas for new commands, I'd love to see them. Or anything really. Just help pls thx.

## So what's next?

I'm self-learning how to code, and this bot is how. More serious features will be added as I get more knowledge and I will hopefully fix my trash code some day. Currently, I'm working on databases and... things don't look good. But in the end of the day, I really really enjoy working on this, even if it doesn't serve any purpose.
