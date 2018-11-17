# Discord bot

Template project on JavaScript ES6 for make Discord bot on NodeJs with using [discord.js](https://discord.js.org)

## Install
```
npm instal
```

## Settings
Set settings for your bot in `config.js`. Source:
```javascript
export default {
    
    // The bot's command prefix. The bot will recognize as command 
    // any message that begins with it.
    // i.e: "-bot foo" will trigger the command "foo"
    prefix: ['-bot'],

    // Your bot's token. If you don't know what that is, go here:
    // https://discordapp.com/developers/applications
    // Then create a new application and grab your token.
    token: '',
    
    // Root administrators - user ID number who can shutdown the bot
    rootAdmins: []
};
```  

## Run
For development in first terminal run webpack in listen mode.
It can make single file bot script in folder `build` 
```
npm run dev 
```
In second terminal run bot script
```
npm run bot 
```

For invite bot to your server/guild open in browser link like
```
https://discordapp.com/oauth2/authorize?client_id=[bot_client_id]&scope=bot&permissions=[bot_permissons]
```
Parameters `bot_client_id`, `bot_permissions` and other manege you can find  on [DEVELOPER PORTAL](https://discordapp.com/developers/applications). 

## How to add new command
1. In folder `commands` clone file `about.js`.
2. Customise data in `meta` object. Parameters:
    - **id** {[array]} - array command identifiers
    - **description** {String} - bot description,
    - **help** {Discord.Embed} - embed object for show command details
    - **dmSupport** {Bool} - support this command in private messages,
    - **channelSupport** {Bool} - support this command in public text channels,
    - **adminOnly** {Bool} - command only for administrator users
3. Modify `execute` function for your task.
4. Add Import `Your Command` to `commands/index.js`.
5. Add translation of `Your Command Descripition` to language files in folder `translate`, if you didn't add translation the description wiil be used without translation.

## Other
- Official discord documentation https://discordapp.com/developers/doc
- Embed Visualizer https://leovoel.github.io/embed-visualizer/
- Discord Bot creating guide https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/getting-started/getting-started-long-version.md