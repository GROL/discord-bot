import Discord from 'discord.js';

import cfg from './config';
import AllCommands from './commands';
import { supportedLangs } from './translate/index';
import CommandHelp from './commands/help';

const discordClientStatus = ['READY', 'CONNECTING', 'RECONNECTING', 'IDLE', 'NEARLY', 'DISCONNECTED'];

/**
 * Bot class
 * Example use:
 *   let bot = new WoWSDiscordBot();
 *   bot.start();
 */
export default class DiscordBot {
    /**
     * Class constructor
     */
    constructor() {
        this.commands = AllCommands;
        // Init Discord
        this._initDiscord();
    }

    
    /**
     * Start Discord bot
     */
    start() {
        this.discord.login(cfg.token)
            .then(() => {
                console.log(this.discord.user.username + ' started');
            });
    }

    /**
     * Init Discord and events listeners
     */
    _initDiscord() {
        this.discord = new Discord.Client();

        // Receive when the client becomes ready to start working.
        this.discord.on('ready', () => this.logStatus('Ready'));

        // Receive message when bot join to server/guild
        this.discord.on('guildCreate', guild => this.onJoinToGuild(guild));

        // Receive discord chanel messages
        this.discord.on('message', msg => this.onDiscordMessage(msg));

        // Receive web socked error messages. If no handled this messages then node app crashes        
        this.discord.on('error', error => this.logStatus(error));
        
        // Receive general warnings.
        this.discord.on('warn', info => this.logStatus(info));

        // Receive when the client's WebSocket disconnects and will no longer attempt to reconnect.
        this.discord.on('disconnect', event => this.logStatus(event));

        // Receive whenever the client tries to reconnect to the WebSocket.
        this.discord.on('reconnecting', () => this.logStatus('Reconnecting'));

        // Receive whenever a WebSocket resumes
        this.discord.on('resume', replayed => this.logStatus('Replayed times ' +  info));
    }

    logStatus(info) {
        console.log(new Date().toLocaleTimeString() + ': bot status ' + discordClientStatus[this.discord.status], info);
    }

    /**
     * Check text to if start of any
     * @param {string} text
     * @param {Array} array
     */
    isStartWith(text, array) {
        if (!Array.isArray(array)) array = array.split(',');

        return array.some(value => text.startsWith(value));
    }

    /**
     * Processing receive messages
     * @param {Message} message Discord Message object
     */
    onDiscordMessage(message) {
        // Fired when someone sends a message
        try {
            // Debug log
            if (message.author.id !== this.discord.user.id) {
                console.log(new Date().toLocaleTimeString() + ': message ', message.channel);
            }

            const msgContent = message.content.trim();

            // No process if message empty or author is bot
            if (!msgContent || message.author.bot) return;

            // Command to bot if this private channel
            let toBot =  message.channel.type === 'dm' ||
                // Or message start with "bot_name"
                msgContent.startsWith('<@' + this.discord.user.id + '>') ||
                this.isStartWith(msgContent, cfg.prefix);

            // Reply only if command to bot
            if (toBot) {
                let command = msgContent.split(' ');

                // Remove prefix if this not dm chanel (private message)
                if (message.channel.type !== 'dm') command = command.slice(1);
                console.log('Commands:', command);

                if (command.length === 0) {
                    // No command
                    message.reply('Hello!'.translate('en'));
                } else {
                    // Flag for out help info, if any command not recognized 
                    let isProcessed = false;
                    isProcessed = this.commands.some(processedCommand => {
                        const metaCommand = processedCommand.meta;
                        const process = this.isCommand(command[0], metaCommand.id);

                        // Find command
                        if (process) {
                            console.log('Execute', metaCommand.description);

                            // If need help for specified command and help-object exist in command
                            if (command.length > 1 && this.isCommand(command[1], CommandHelp.meta.id) &&
                                metaCommand.hasOwnProperty('help')) {
                                // Reply Embed help-object
                                message.reply({
                                    embed: {
                                        ...metaCommand.help,
                                        color: 0x00CC00,
                                        title: metaCommand.description
                                    }
                                });
                            } else {
                                // Make object for processed command
                                const newInstance = new processedCommand(); 
                                newInstance.execute(this, message, command)
                                    .catch(error => {
                                        console.log(error);
                                    })
                            }
                        }

                        return process;
                    });

                    if (!isProcessed) {
                        // Unknown command, out help
                        const helpReply = new CommandHelp();
                        helpReply.execute(this, message, command); 
                    }
                }
            }
        } catch (e) {
            console.log('Error', e);
            const error = new Discord.RichEmbed()
                .setTitle('Error'.translate('en'))
                .setColor(0xff0000)
                .setDescription(e.toString());
            message.reply(error);
        }
    }

    /**
     * Make welcome message for first message when bot joined to server
     * @param {string} lang Language
     */     
    makeWelcomeMsg(lang) {
        const welcome = new Discord.RichEmbed()
            .setAuthor(this.discord.user.username, this.discord.user.avatarURL)
            .setTitle('Hello!'.translate(lang))
            .setColor(0x6666dd)
            .setDescription('Welcome message'.translate(lang).format(this.discord.user.username, cfg.prefix))
            .addField(
                'Supported languages'.translate(lang),
                Object.keys(supportedLangs)
                    .map(key => `${supportedLangs[key].icon.char} ${supportedLangs[key].title}`).join('\n') +
                    '\n' + 'Click on emoji button for see this message by your language.'.translate(lang)
            );
        return welcome;
    }

    /**
     * Return default guild channel
     * Discord.Guild.defaultChannel is DEPRECATED
     * @param {*} guild Discord.Guild object
     */
    getTextChannel(guild) {
        // Get channel from config
        const ResultId = guild.systemChannelID;
        let Result;
        // If not set
        if (!ResultId) {
            // Find first Text chanel for use as default
            guild.channels.some(channel => {
                Result = channel.type === 'text' && !channel.deleted ? channel : null;
                return Result;
            });
        } else {
            Result = guild.channels.get(ResultId);
        }

        return Result;
    }


    /**
     * Check command
     * @param {string} command Command user's entered
     * @param {Array} identity Array of string identifier
     */
    isCommand(command, identity) {
        return identity.indexOf(command.toLowerCase()) !== -1;
    }

    /**
     * Find гильдии, известной боту, в которой есть Discord пользователь
     * @param {Object} user Discord.User object
     */
    findUserGuild(user) {
        const Result = this.discord.guilds.filter(guild => {
            guild.members.get(user.id);
        });
        console.log('User in', Result.length);

        return Result;
    }

    /**
     * Join to Server/Guild
     * @param {Object} guild Discord.Guild object
     */
    onJoinToGuild(guild) {
        let message;

            // Set config to runtime for speed

            const channel = this.getTextChannel(guild);
            console.log(channel);
            if (channel) {
                channel.send(this.makeWelcomeMsg('en'))
                    .then(msg => {
                        message = msg;
                        // Get emoji unicode chars for buttons
                        const langs = Object.keys(supportedLangs)
                            .map(key => supportedLangs[key].icon.char)
                            .reverse();
                        const reacts = langs.map(lang => msg.react(lang));
                        return Promise.all(reacts);
                    })
                    .then(() => {
                        const collector = message.createReactionCollector((reaction, user) => user !== this.discord.user);
                        collector.on('collect', reaction => {
                            console.log('reaction', reaction);
                            const langs = Object.keys(supportedLangs);

                            for (let i = 0; i < langs.length; i++) {
                                if (supportedLangs[langs[i]].icon.char === reaction.emoji.name) {
                                    message.edit(this.makeWelcomeMsg(langs[i])).then(() => {});
                                }
                            }

                            // Get the user that clicked the reaction and remove the reaction.
                            const notbot = reaction.users.filter(user => user !== this.discord.user).first();
                            reaction.remove(notbot);
                        });
                    });
            }
        ;
    }
}
