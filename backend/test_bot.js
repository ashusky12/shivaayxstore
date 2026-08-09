const TelegramBot = require('node-telegram-bot-api');
console.log("Type of TelegramBot:", typeof TelegramBot);
if (TelegramBot) {
  console.log("Is it a constructor?", typeof TelegramBot === 'function');
  console.log("Default property type:", typeof TelegramBot.default);
}
