const TelegramBot = require('node-telegram-bot-api');
const token = '8921611493:AAH8_TWPLZSLHO_xIrv3SrfmAGsS9JRHn-s';
const BotClass = typeof TelegramBot === 'function' ? TelegramBot : TelegramBot.default;
const bot = new BotClass(token);
bot.getMe()
  .then(me => console.log("SUCCESS: Bot is valid! Info:", me))
  .catch(err => console.error("ERROR fetching bot info:", err.message, err));
