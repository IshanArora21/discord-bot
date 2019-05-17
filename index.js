const Discord = require("discord.js");
const bot = new Discord.Client();

const config = require("./config.json");
bot.login(config.token);

bot.on("ready", () => {
  
  console.log(`Successfully started. Users: ${bot.users.size} Servers: ${bot.guilds.size}`);
  bot.user.setActivity(`My prefix is !`);
  
});

bot.on("guildCreate", guild => {

  console.log(`Joined a new server! (${guild.name}) This server has ${guild.memberCount} members currently!`);
  
});

bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;


    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if(command === "ping") {
 
      const m = await message.channel.send("Ping?");
    }

    if(command === "say") {
      repeat = args.join(" ");
      message.delete();
      message.channel.send(repeat); 
      
    }

    if(command === "stop"){
      bot.destroy();
    }
});
