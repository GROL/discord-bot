import pkg from '../../package.json';
import AbstractBotCommand from './abstract';

export default class CommandAbout extends AbstractBotCommand {
    static meta =  {
        id: ['about'],
        description: 'About this bot',
        help: null,
        dmSupport: true,
        channelSupport: true,
        adminOnly: false
    };

    /**
     * Out discord bot name and version
     * @param {DiscordBot} app - Bot application
     * @param {Discord.Message} message - Received message
     * @param {array} command Array of string from message content
     */
    execute(app, message, command) {
        return this.sendMessage(`${app.discord.user.username} ver ${pkg.version}`, message.channel);
    }
}
