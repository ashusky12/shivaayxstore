const TelegramBot = require('node-telegram-bot-api');
const token = '8921611493:AAH8_TWPLZSLHO_xIrv3SrfmAGsS9JRHn-s';
const BotClass = typeof TelegramBot === 'function' ? TelegramBot : TelegramBot.default;
const bot = new BotClass(token);

const text = `
🔥 *ShivaayXStore Admin Bot* 🔥

Aap is bot ke zariye step-by-step account publish kar sakte hain.

Shuru karne ke liye **\`/new\`** command type karein ya direct account ki **screenshot image** upload karein!
`;

console.log("Attempting to send message...");
bot.sendMessage(8688705501, text, { parse_mode: 'Markdown' })
  .then(res => console.log("SUCCESS:", res))
  .catch(err => {
    console.error("ERROR:", err.message);
    console.error(err.stack);
  });
