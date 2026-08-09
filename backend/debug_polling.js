const TelegramBot = require('node-telegram-bot-api');
const token = '8921611493:AAH8_TWPLZSLHO_xIrv3SrfmAGsS9JRHn-s';
const BotClass = typeof TelegramBot === 'function' ? TelegramBot : TelegramBot.default;
const bot = new BotClass(token, { polling: true });
bot.on('polling_error', (err) => {
  console.error("POLLING ERROR DETAILS:", err.code, err.message, err);
});
bot.on('message', (msg) => {
  console.log("RECEIVED MESSAGE:", msg.text);
});
setTimeout(() => {
  console.log("Closing debug process...");
  process.exit(0);
}, 6000);
