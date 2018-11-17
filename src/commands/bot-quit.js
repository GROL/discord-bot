import cfg from '../config';
import AbstractBotCommand from './abstract';

export default class CommandBotQuit extends AbstractBotCommand {
    static meta = {
        id: ['quit'],
        description: 'Quit bot (move to offline)',
        help: null,
        dmSupport: true,
        channelSupport: false,
        adminOnly: true
    };

    /**
     * 
     * @param {DiscordBot} app - Bot application
     * @param {Discord.Message} message - Received message
     * @param {array} command Array of string from message content
     */
    execute(app, message, command) {
        // Only bot admin can vy shutdown
        if (cfg.rootAdmins.indexOf(message.author.id) !== -1) {
            return app.discord.destroy(() => {
                console.log('Bot logout');
                return Promise.resolve();
            });
        } else {
            return this.sendMessage('Need admin permissions', message.channel);
        } 
    }
}
