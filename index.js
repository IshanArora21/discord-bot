const Discord = require("discord.js");
const bot = new Discord.Client();


bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
  
  console.log(`Successfully started. Users: ${bot.users.size} Servers: ${bot.guilds.size}`);
  bot.user.setActivity(`My prefix is !`);
  
});

bot.on("guildCreate", guild => {

  console.log(`Joined a new server! (${guild.name}) This server has ${guild.memberCount} members currently!`);
  
});

bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.content.indexOf("!") !== 0) return;


    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if(command === "ping") {
 
      const m = await message.channel.send("Ping?");
    }

    if(command === "say") {
      repeat = args.join(" ");
      message.delete().catch(error => {});
      message.channel.send(repeat); 
      
    }

    if(command === "dm”){
      dm = args.join(“ “);
      message.author.send(dm);
    }
});
