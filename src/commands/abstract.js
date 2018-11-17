/**
 * Base class for make discord command. All commands must inherited by this class
 */
export default class AbstractBotCommand {
    // Each inherited classes must set static meta object with follow info:
    // const meta = {
    //     id {[array]} - array command identifiers
    //     description {String} - bot descriptor,
    //     help {Discord.Embed} - embed object for show command detail
    //     dmSupport {Bool} - support this command in private messages,
    //     channelSupport {Bool} - support this command in public text channels,
    //     adminOnly {Bool} - command only for administrator users
    // };

    /**
     * Executed command can return Promise<object> 
     * @param {DiscordBot} app - Bot application
     * @param {Discord.Message} message - Received message
     * @param {array} command Array of string from message content
     */
    execute(app, message, command) {
        return Promise.resolve({});
    }

    /**
     * Send message to Discord channel. Return promise with last send result
     * @param {String|Object} message Sanded message
     * @param {Chanel} Discord.Chanel object for channel where to send message
     */
    sendMessage(message, channel) {
        let Result;

        if (typeof message === 'string') {
            // Message length limit of 2000 chars
            if (message.length < 2000) {
                Result = channel.send(message);
            } else {
                // Split message for send by parts
                let lines = message.split('\n');

                // Buffer message
                let toMessage = '';

                lines.forEach(line => {
                    if (toMessage.length + line.length + 2 < 2000) {
                        toMessage = toMessage + line + '\n';
                    } else {
                        // Buffer "full", send part
                        Result = channel.send(toMessage);
                        toMessage = line + '\n';
                    }
                });
                if (toMessage) Result = channel.send(toMessage);
            }
        } else {
            // Embed object like:
            // message = new Discord.RichEmbed()
            Result = channel.send(message);
        }

        return Result;
    }
}
