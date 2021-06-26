# Tutu Bot

Poorly-coded bot intended to be used in my and my friends' servers.

- Epic Reddit command: show a random post from any subreddit of your choice, or show top posts of the day/week/month etc.
  - Or, use one of the many pre-defined Reddit commands for memes, NSFW content and more.
- Search for any term using the Urban Dictionary. That website has definitions for literally everything.
- (Coming soon) Search for more serious definitions using the Google Dictionary, including examples, synonyms and more.
- Or just use the useless commands that I made back when I was still watching JavaScript tutorials, such as ,coinflip and ,pp ;)

See the full command list [here](https://imvasi.com/#commands).

Add the Tutu Bot to your Discord server by visiting my [Tutu Bot Website](https://imvasi.com/tutu).  
The bot is now running 24/7!  

If you want to host the bot by yourself, make changes or contribute, read below.

## Installation

If you've decided to host the bot by youself, you'll need to follow these steps:  

Firstly, clone the repo
```
git clone https://github.com/down-bad/TutuBot.git
```
After cloning, run
```
npm install
```
to install the required dependencies. Obviously, you need [node](https://nodejs.org/en/) installed.

## Set up

- Rename the `rename_me.json` file to `config.json`.
- Now, open it and fill out the required information:
  - `token`: Your token
  - `ownerID`: Your Discord user ID

  - `redditCredentials`: This bot uses Reddit for some commands and most of the NSFW ones. In order to set up Reddit for the bot:
    - Go to [Authorized applications](https://reddit.com/prefs/apps/)
    - Press "Create an app"
    - Enter an application name, a description and a redirect uri (if you're not sure about the redirect uri, just put `http://localhost:8080`)
    - Choose "script" in the list - that's important
    - Press the "Create app" button

You will get the app's ID under the "personal use script" line and the secret hash.  
So now, in `config.json`, you can fill the required Reddit information.  

Run `index.js` to give life to the bot. (`node index.js`)  

Note: the `coinflip` command uses custom emotes. You can find them in the `custom emotes` folder but you will have to set them up by yourself in `coinflip.js`.

## Can/Should I contribute?

PLEASE feel free to. I'd love to see how my code can be improved and would totally help me learn for the future. Or if you have any ideas for new commands, I'd love to see them. Or anything really. Just help pls thx.

## So what's next?

I'm self-learning how to code, and this bot is how. More serious features will be added as I get more knowledge and I will hopefully fix my trash code some day. Currently, I'm working on databases and... things don't look good. But in the end of the day, I really really enjoy working on this, even if it doesn't serve any purpose.
