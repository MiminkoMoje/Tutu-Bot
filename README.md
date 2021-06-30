<img width="150" height="150" alt="Tutu Logo" src="https://imvasi.com/images/tutu_logo_square.png">

# Tutu Bot

A powerful Reddit-based Discord bot:

    - Get random posts from any subreddit
    - Get the top posts of the hour/day/week/month/year/overall
    - Get any posts by their ID  

    - Uses reactions and buttons for fast and easy browsing
    - Pre-defined commands for specific subreddits for a more user-friendly use, such as commands for memes, NSFW content and more
    - NSFW protection, NSFW posts can only be shown in NSFW channels  

Browse Reddit right from your Discord server.

### Ubran Dictionary
    - Quickly get any definition from [Urban Dictionary](https://www.urbandictionary.com/)
    - Includes examples, likes and dislikes, date, and author

#### See all the available commands [here](https://imvasi.com/#commands)

## Add it to your server

Invite Tutu Bot to your server here: https://imvasi.com

If you want to host the bot by yourself, make changes or contribute, read below.

## Host it by yourself

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