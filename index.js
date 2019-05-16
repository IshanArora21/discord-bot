
const Discord = require("discord.js");
const bot = new Discord.Client();

const configuration = require("./config.json");

bot.on("ready", () => {
  
  console.log('Successfully started. Users: ${bot.users.size} Servers: ${bot.guilds.size}');
  bot.user.setActivity('My prefix is !');
  
});
