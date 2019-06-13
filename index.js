const Discord = require("discord.js");
const bot = new Discord.Client();
var flashcards = [];
var i = 0;
bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
  
  console.log(`Successfully started. Users: ${bot.users.size} Servers: ${bot.guilds.size}`);
  bot.user.setActivity(`!help for commands`);
  
});

bot.on("guildCreate", guild => {

  console.log(`Joined a new server! (${guild.name}) This server has ${guild.memberCount} members currently!`);
  
});


bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.content.indexOf("!") !== 0) return;


    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    if(command === "setQ"){
      question = args.join(" ");
      flashcards[i] = question;
      message.channel.send("Succesfully added question!");
      i++;
    }
    if(command === "q"){
      message.channel.send(flashcards[parseInt(args[0],10)]);
    }

    if(command === "ping") {
      
      const lat = await message.channel.send("Ping!");
      lat.edit(`Pong! Current latency is ${lat.createdTimestamp - message.createdTimestamp}ms`);
    }

    if(command === "say") {
      repeat = args.join(" ");
      message.delete().catch(error => {});
      message.channel.send(repeat); 
      
    }
   if(command === "sol") {
    message.channel.send("sol");

}
  if(command === "dm") {
      dm = args.join(" ");
      let dmTarget = message.guild.member(message.mentions.users.first());
      if (!dmTarget) return message.channel.send("I cannot find the targetted user!");
      dmTarget.send(dm);
      
    }
    if(command === "purge") {
 
    

    const msgCount = parseInt(args[0], 10);
    if(!msgCount || msgCount < 1 || msgCount > 50) return message.reply("Specify a number between 1 - 50!");
    const fetch = await message.channel.fetchMessages({limit: msgCount});
    message.channel.bulkDelete(fetch).catch(exception => message.reply(`Error occured! Please message developers. ${exception}`));
  }
    
   if(command === "help") {
     message.author.send({embed: {
    color: 3447003,
    title: "Command Menu!",
    description: "All of the nifty features of this bot!",
    fields: [{
        name: "Ping",
        value: "!ping - Returns the message Pong"
      },
      {
        name: "DM",
        value: "!dm (user) (message) - Sends a message to a user!"
      },
      {
        name: "Say",
        value: "!say (message) - Make the bot say a message!"
      }
    ]
  }
});
     
   }
  
});
