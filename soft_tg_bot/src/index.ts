import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { beginCell, toNano } from "ton-core";
import qs from "qs";
import http from 'http';

const PORT = process.env.PORT || 3000;
http.createServer((_, res) => res.end('OK')).listen(PORT);

dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TG_BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("Bot token not found! Set either BOT_TOKEN or TG_BOT_TOKEN in environment variables");
}
const BOT_ADDRESS = process.env.BOT_ADDRESS || process.env.SC_ADDRESS;
if (!BOT_ADDRESS) {
  throw new Error("Bot address not found! Set either BOT_ADDRESS or SC_ADDRESS in environment variables");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply("Welcome to our counter app!!", {
    reply_markup: {
      keyboard: [
        [{ text: "Increment by 5" }],
        [{ text: "Deposit 1 TON" }],
        [{ text: "Withdraw 0.7 TON" }],
      ]
    },
  })
);

bot.on(message("web_app_data"), (ctx) => ctx.reply("ok"));

bot.hears("Increment by 5", (ctx) => {
  const msg_body = beginCell() 
    .storeUint(1, 32)
    .storeUint(5, 32)
    .endCell();

  const link = `https://app.tonkeeper.com/transfer/${BOT_ADDRESS}?${qs.stringify({
    text: "Increment by 5",
    amount: toNano("0.05").toString(10),
    bin: msg_body.toBoc({ idx: false }).toString("base64"),
  })}`;

  ctx.reply("To increment counter by 5, please sign a transaction:", {
    reply_markup: {
      inline_keyboard: [[{
        text: "Sign transaction",
        url: link,
      }]]
    }
  });
});

bot.hears("Deposit 1 TON", (ctx) => {
  const msg_body = beginCell().storeUint(2, 32).endCell();

  const link = `https://app.tonkeeper.com/transfer/${BOT_ADDRESS}?${qs.stringify({
    text: "Deposit 1 TON",
    amount: toNano("1").toString(10),
    bin: msg_body.toBoc({ idx: false }).toString("base64"),
  })}`;

  ctx.reply("To deposit 1 TON, please sign a transaction:", {
    reply_markup: {
      inline_keyboard: [[{
        text: "Sign transaction",
        url: link,
      }]]
    }
  });
});

bot.hears("Withdraw 0.7 TON", (ctx) => {
  const msg_body = beginCell()
    .storeUint(3, 32)
    .storeCoins(toNano("0.7"))
    .endCell();

  const link = `https://app.tonkeeper.com/transfer/${BOT_ADDRESS}?${qs.stringify({
    text: "Withdraw 0.7 TON",
    amount: toNano("0.05").toString(10),
    bin: msg_body.toBoc({ idx: false }).toString("base64"),
  })}`;

  ctx.reply("To withdraw 0.7 TON, please sign a transaction:", {
    reply_markup: {
      inline_keyboard: [[{
        text: "Sign transaction",
        url: link,
      }]]
    }
  });
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));