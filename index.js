const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const bot = new Discord.Client();
let p = "!";
const queue = new Map();
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

async function execute(message, serverQueue) {
  message.channel.send("1");
  const args = message.content.split(" ");

  const voiceChannel = message.member.voiceChannel;
  message.channel.send("1.5");
 
  message.channel.send("2");

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    message.channel.send("3");
    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);
    message.channel.send("4");
    try {
      message.channel.send("hit in execute");
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      message.channel.send("hit in catch *WARNING*");
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    message.channel.send("5");
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  return message.channel.send("Stopped songs...");
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", () => {
      console.log("Music ended!");
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => {
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(p) !== 0) return;

  const args = message.content
    .slice(1)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  const serverQueue = queue.get(message.guild.id);
  if (command === "play") {
    execute(message, serverQueue);
    return;
  }
  if (command === "skip") {
    skip(message, serverQueue);
    return;
  }
  if (command === "stop") {
    stop(message, serverQueue);
    return;
  }

  if (command === "ping") {
    const lat = await message.channel.send("Ping!");
    lat.edit(
      `Pong! Current latency is ${lat.createdTimestamp -
        message.createdTimestamp}ms`
    );
  }
  if (command === "restart") {
    message.channel
      .send("Restarting...")
      .then(msg => bot.destroy())
      .then(() => bot.login(process.env.BOT_TOKEN));
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

  if (command === "uwu") {
    message.channel.send(
      "https://tenor.com/view/animu-anime-goodnight-gif-14037293 -Ishan"
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
