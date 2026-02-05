import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { beginCell, toNano } from "ton-core";
import qs from "qs";

dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TG_BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("Bot token not found! Set either BOT_TOKEN or TG_BOT_TOKEN in environment variables");
}
const BOT_ADDRESS = process.env.BOT_ADDRESS || process.env.SC_ADDRESS;
if (!BOT_ADDRESS) {
  throw new Error("Bot address not found! Set either BOT_ADDRESS or SC_ADDRESS in environment variables");
}



const bot = new Telegraf(BOT_TOKEN); //iniiate bot instance with HTTP API key in Botfather

bot.start((ctx) =>
    ctx. reply ("Welcome to our counter app!", {
      reply_markup: {
        keyboard: [
          ["Increment by 5"],
          ["Deposit 1 TON"],
          ["Withdraw 0.8 TON"],
        ],
      },
    })
  );
  bot.on(message("web_app_data"), (ctx) => ctx.reply("ok"));

  bot.hears("Increment by 5", (ctx) => {
    //TODO: send increment transaction
    const msg_body = beginCell() 
    .storeUint(1, 32)
    .storeUint(5, 32)
    .endCell();

    let link = `ton://transfer/${BOT_ADDRESS}?${qs.stringify(
      {
        text: "Simple test transaction",
        amount: toNano("0.05").toString(10),
        bin: msg_body.toBoc({ idx: false }). toString("base64"),
      }
  )}`;

  ctx.reply("To increment counter by 5, please sign a transaction:", {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Sign transaction",
                url: link,
            }]
        ]
    }
});
  });


  bot.hears("Deposit 1 TON", (ctx) => {
     //TODO: Deposit 1 TON
    const msg_body = beginCell().storeUint(2, 32).endCell();

      
    let link = `https://app.tonkeeper.com/transfer/${
        BOT_ADDRESS
    }?${qs.stringify(
        {
            text: "Deposit 1 TON",
            amount: toNano("1").toString(10),
            bin: msg_body.toBoc({ idx: false}).toString("base64"),
        }
    )}`;
    // TODO: send deposit transaction
    ctx.reply("To deposit 1 TON please sign a transaction:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Sign transaction",
              url: link,
            }
          ]
        ]
      }
    });
    
  });
  
  bot.hears ("Withdraw 0.7 TON", (ctx) => {
    // TODO: send withdraw transaction
    const msg_body = beginCell().storeUint(3, 32).storeCoins(toNano(`0.7`)).endCell();
  
    let link = `https://test.tonhub.com/transfer/${
      BOT_ADDRESS
    }?${qs.stringify({
      text: "Withdraw 0.7 TON",
      amount: toNano('0.05').toString (10),
      bin: msg_body.toBoc({ idx: false }).toString("base64"), 
    })}`;
        
    ctx.reply("To withdraw 0.7 TON please sign a transaction:", {
      reply_markup: {
          inline_keyboard: [
              [{
                  text: "Sign transaction",
                  url: link,
              }]
          ]
      }
  });    
  });

  bot.launch();

  
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop ("SIGTERM"));


