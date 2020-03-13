const Discord = require("discord.js");
const bot = new Discord.Client();
let p = "!";
bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
  console.log(
    `Successfully started. Users: ${bot.users.size} Servers: ${bot.guilds.size}`
  );
  bot.user.setActivity(`!help for commands`);
});

bot.on("guildCreate", guild => {
  console.log(
    `Joined a new server! (${guild.name}) This server has ${guild.memberCount} members currently!`
  );
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(p) !== 0) return;

  const args = message.content
    .slice(1)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const lat = await message.channel.send("Ping!");
    lat.edit(
      `Pong! Current latency is ${lat.createdTimestamp -
        message.createdTimestamp}ms`
    );
  }
  if (command === "restart") {
    channel
      .send("Restarting...")
      .then(msg => client.destroy())
      .then(() => client.login(process.env.BOT_TOKEN));
  }
  if (command === "say") {
    repeat = args.join(" ");
    message.delete().catch(error => {});
    message.channel.send(repeat);
  }
  if (command === "sol") {
    message.channel.send("sol");
  }
  if (command === "dm") {
    dm = args.join(" ");
    let dmTarget = message.guild.member(message.mentions.users.first());
    if (!dmTarget)
      return message.channel.send("I cannot find the targetted user!");
    dmTarget.send(dm);
  }
  if (command === "d") {
    var test = args[1];
    var dice = args[0];
    var sum = parseInt("0");
    for (var i = 0; i < test; i++) {
      var response = [Math.floor(Math.random() * dice + 1)];
      sum = sum + parseInt(response);
      message.channel
        .send("You rolled " + response + "!")
        .then()
        .catch(console.error);
    }
    message.channel.send("The sum is: " + sum);
  }

  if (command === "d20") {
    var test = args.join(" ");
    for (var i = 0; i < test; i++) {
      var response = [Math.floor(Math.random() * 20 + 1)];
      message.channel
        .send("You rolled " + response + "!")
        .then()
        .catch(console.error);
    }
  }
  if (command === "d4") {
    var response = [Math.floor(Math.random() * 4 + 1)];
    message.channel
      .send("You rolled " + response + "!")
      .then()
      .catch(console.error);
  }
  if (command === "d10") {
    var response = [Math.floor(Math.random() * 10 + 1)];
    message.channel
      .send("You rolled " + response + "!")
      .then()
      .catch(console.error);
  }
  if (command === "d8") {
    var response = [Math.floor(Math.random() * 8 + 1)];
    message.channel
      .send("You rolled " + response + "!")
      .then()
      .catch(console.error);
  }

  if (command === "prefix") {
    p = args.join(" ");
    message.channel.send("Prefix has been changed! (" + p + ")");
    bot.user.setActivity(p + `help for commands!`);
  }

  if (command === "purge") {
    const msgCount = parseInt(args[0], 10);
    if (!msgCount || msgCount < 1 || msgCount > 50)
      return message.reply("Specify a number between 1 - 50!");
    const fetch = await message.channel.fetchMessages({ limit: msgCount });
    message.channel
      .bulkDelete(fetch)
      .catch(exception =>
        message.reply(`Error occured! Please message developers. ${exception}`)
      );
  }

  if (command === "help") {
    message.author.send({
      embed: {
        color: 3447003,
        title: "Command Menu!",
        description: "All of the nifty features of this bot!",
        fields: [
          {
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
