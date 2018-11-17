import DiscordBot from './bot';
import cfg from './config';

if (cfg.token) {
    const bot = new DiscordBot();
    bot.start();
} else {
    console.log('Please set Discord token for your bot in config.js');
} 
