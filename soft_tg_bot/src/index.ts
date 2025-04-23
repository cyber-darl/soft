import dotenv from "dotenv"
import { Telegraf } from "telegraf";

dotenv.config();
const bot = new Telegraf(process.env.TG_BOT_TOKEN!);

bot.start((ctx) =>
    ctx. reply ("Welcome to our counter app!", {
      reply_markup: {
        keyboard: [
          ["Increment by 5"],
          ["Deposit 1 TON"],
          ["Withdraw 0.7 TON"],
        ],
      },
    })
  );

  bot.hears("Increment by 5", (ctx) => {
    // TODO: send increment transaction
    ctx.reply("Incremented by 5");
  });
  bot.hears("Deposit 1 TON", (ctx) => {
    // TODO: send deposit transaction
    ctx.reply("Deposited 1 TON");
  });
  
  bot.hears ("Withdraw 0.7 TON", (ctx) => {
    // TODO: send withdraw transaction
    ctx.reply("Withdrawn 0.7 TON");
  });

  bot.launch();

  
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop ("SIGTERM"));


