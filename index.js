const Discord = require("discord.js");
const bot = new Discord.Client();


bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
  
  console.log(`Successfully started. Users: ${bot.users.size} Servers: ${bot.guilds.size}`);
  bot.user.setActivity(`Blame Ishan`);
  
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
      
      const m = await message.channel.send("Pong");
    }

    if(command === "say") {
      repeat = args.join(" ");
      message.delete().catch(error => {});
      message.channel.send(repeat); 
      
    }
  if(command === "dm") {
      dm = args.join(" ");
      let dmTarget = message.guild.member(message.mentions.users.first());
      if (!dmTarget) return message.channel.send("I cannot find the targetted user!");
      dmTarget.send(dm);
      
    }
    
   if(command === "help" || "commands") {
     var commandsList = "!ping, !say [Message], !dm [User] [Message]"
     help = args.join(" ");
     commands = args.join(" ");
     let dmTarget = message.guild.member(message.mentions.users.first());
     dmTarget.send(commandsList);
     
   }
  
});
