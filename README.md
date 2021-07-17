<img width="150" height="150" alt="Tutu Logo" src="https://imvasi.com/images/tutu_logo_square.png">

# Tutu Bot

A powerful, Reddit-focused Discord bot.

Invite it to your server: https://imvasi.com/tutubot

## Features 

### Reddit

- 🔀 Get random posts of any subreddit
- 🔝 Get top posts, hourly/daily/weekly/monthly/yearly/overall
- 🆔 Get posts by their ID
- 💨 Easy and fast navigation with reactions
- 🔞 NSFW protection, such posts are only shown in NSFW channels
- 😌 Many predefined, user-friendly subreddit commands, for memes, cute animals, etc. with more getting added over time

### Urban Dictionary

- 🔎 Get definitions for anything, using [Urban Dictionary](https://www.urbandictionary.com/)
- 💬 Includes examples, likes & dislikes, and author
- 💨 Easy and fast navigation with reactions

## Installation

### Hosted Version

Tutu Bot is already hosted by me and is running 24/7.  
You can invite it to your server here:  
https://imvasi.com/tutubot

### Install & Host by yourself

There are many reasons why you would want to do that, such as customizing the bot to your likings.
You must follow these instructuons in order to install it properly:

Clone the repo
```
git clone https://github.com/down-bad/TutuBot.git
```
Then, run
```
npm install
```
to install the required dependencies. Make sure you have [Node](https://nodejs.org/en/) installed.

#### Edit the configuration

Rename the `rename_me.json` file to `config.json`.

Fill out the required information:
- `token`: Your bot token
- `ownerID`: Your Discord user ID

You need to obtain a Reddit app ID & secret hash in order to use the Reddit functionality of this bot, using the following instructions:
- Go to [Authorized applications](https://reddit.com/prefs/apps/)
- Press "Create an app"
- Enter an application name, a description and a redirect uri (if you're not sure about the redirect uri, just put `http://localhost:8080`)
- Choose "script" in the list - that's important
- Press the "Create app" button

You will get the app's ID under the "personal use script" line and the secret hash.  

In `config.json`, fill out the `redditCredentials`:
- `username`: Your Reddit username
- `password`: Your Reddit password
- `app_id`: The app ID you obtained above
- `api_secret`: The secret hash you obtained above

Make sure you're using the Reddit account that you got the ID with.

Run
```
node index.js
```
to run the bot.  
Enjoy!
