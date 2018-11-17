import AbstractBotCommand from './abstract';
import cfg from '../config';
import Discord from 'discord.js';

export default class CommandHelp extends AbstractBotCommand {
    static meta =  {
        id: ['help'],
        description: 'This help',
        help: null,
        dmSupport: true,
        channelSupport: true,
        adminOnly: false
    };
    
    /**
     * String check for this commands
     */
    isCommand(command) {
        return CommandHelp.meta.id.indexOf(command.toLowerCase()) !== -1;
    }

    /**
     * Out list of all bot commands 
     * @param {DiscordBot} app - Bot application
     * @param {Discord.Message} message - Received message
     * @param {array} command Array of string from message content
     */
    execute(app, message, command) {
         
        // TODO: detect user language
        const lang = 'en';

        // Get all commands classes. Filter by public or if author admin 
        let cList = app.commands.filter(command => !command.meta.adminOnly || cfg.rootAdmins.indexOf(message.author.id) !== -1);
        
        // Make human readable list
        const sList = cList.map(command => `  **${command.meta.id.join(', ')}** - ${command.meta.description.translate(lang)}`);
                
        // Notify user what command recognized
        const reply = this.isCommand(command[0]) ? 'Ok. ' : 'Not understood'.translate(lang) + '\n';

        const Result = new Discord.RichEmbed({
            title: ':information_source: Help',
            color: 0x00CC00, 
            description: `${reply}\n${'List of known commands'.translate(lang)}\n` + sList.join('\n')
        });
         
        return this.sendMessage(Result, message.channel);
    }
}
