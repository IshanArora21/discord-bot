
const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const request = require('request');
const fs = require('fs');
const getYoutubeID = require('get-youtube-id');
const youtubeInfo = require('youtube-info');
require('dotenv').config();

let config = require('./settings.json');

const clientToken = process.env.client_TOKEN;
const youtubeAPIKey = process.env.YOUTUBE_API_KEY;
const prefix = config.prefix;
const role = config.role;


const client = new Discord.Client();
let p = "!";
client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  console.log(
    `Successfully started. Users: ${client.users.size} Servers: ${client.guilds.size}`
  );
  client.user.setActivity(`!help for commands`);
});

client.on("guildCreate", guild => {
  console.log(
    `Joined a new server! (${guild.name}) This server has ${guild.memberCount} members currently!`
  );
});



client.on("message", async message => {
  if (message.author.client) return;
  if (message.content.indexOf(p) !== 0) return;

  const member = message.member;
  const msg = message.content.toLowerCase();
  const args = message.content.split(' ').slice(1).join(' ');

  if (!guilds[message.guild.id]) {
    guilds[message.guild.id] = {
      queue: [],
      queueNames: [],
      isPlaying: false,
      dispatcher: null,
      voiceChannel: null,
      skipReq: 0,
      skippers: [], 
      playedTracks: []
    };
  }

  if (message.author.equals(client.user) || message.author.client) return;

  if (msg.startsWith(p + 'play')) {
    if (member.voiceChannel || guilds[message.guild.id].voiceChannel != null) {
      if (guilds[message.guild.id].queue.length > 0 || guilds[message.guild.id].isPlaying) {
        getID(args, function (id) {
          addToQueue(id, message);
          youtubeInfo(id, function (err, videoinfo) {
            if (err) {
              throw new Error(err);
            }
            guilds[message.guild.id].queueNames.push(videoinfo.title);
            addToPlayedTracks(message, videoinfo, message.author);
            message.reply('the song: **' + videoinfo.title + '** has been added to the queue.');
          });
        });
      } else {
        guilds[message.guild.id].isPlaying = true;
        getID(args, function (id) {
          guilds[message.guild.id].queue.push(id);
          playMusic(id, message);
          youtubeInfo(id, function (err, videoinfo) {
            if (err) {
              throw new Error(err);
            }
            guilds[message.guild.id].queueNames.push(videoinfo.title);
            addToPlayedTracks(message, videoinfo, message.author);
            message.reply('the song: **' + videoinfo.title + '** is now playing!');
          });
        });
      }
    } else if (member.voiceChannel === false) {
      message.reply('you have to be in a voice channel to play music!');
    } else {
      message.reply('you have to be in a voice channel to play music!');
    }
  } else if (msg.startsWith(p + 'skip')) {
    if (guilds[message.guild.id].skippers.indexOf(message.author.id) === -1) {
      guilds[message.guild.id].skippers.push(message.author.id);
      guilds[message.guild.id].skipReq++;
      if (guilds[message.guild.id].skipReq >=
      Math.ceil((guilds[message.guild.id].voiceChannel.members.size - 1) / 2) || message.guild.member(message.author.id).roles.find(roles => roles.name === role)) {
        skipMusic(message);
        message.reply('your skip request has been accepted. The current song will be skipped!');
      } else {
        message.reply('your skip request has been accepted. You need **' +
        (Math.ceil((guilds[message.guild.id].voiceChannel.members.size - 1) / 2) -
        guilds[message.guild.id].skipReq) + '** more skip request(s)!');
      }
    } else {
      message.reply('you already submitted a skip request.');
    }
  } else if (msg.startsWith(p + 'queue')) {
    var codeblock = '```';
    for (let i = 0; i < guilds[message.guild.id].queueNames.length; i++) {
      let temp = (i + 1) + '. ' + guilds[message.guild.id].queueNames[i] +
      (i === 0 ? ' **(Current Song)**' : '') + '\n';
      if ((codeblock + temp).length <= 2000 - 3) {
        codeblock += temp;
      } else {
        codeblock += '```';
        message.channel.send(codeblock);
        codeblock = '```';
      }
    }

    codeblock += '```';
    message.channel.send(codeblock);
  } else if (msg.startsWith(p + 'stop')) {
    if (guilds[message.guild.id].isPlaying === false) {
      message.reply('no music is playing!');
      return;
    }

    if (message.guild.member(message.author.id).roles.find(roles => roles.name === role)) {
      message.reply('stopping the music...');

      guilds[message.guild.id].queue = [];
      guilds[message.guild.id].queueNames = [];
      guilds[message.guild.id].isPlaying = false;
      guilds[message.guild.id].dispatcher.end();
      guilds[message.guild.id].voiceChannel.leave();
    } else {
      message.reply("nice try, but only " + role + "s can stop me!");
    }

  } else if (msg.startsWith(p + 'history')){
    let defaultTrackCount = 30;
    argArr = args.split(' ');
    let includeUsers = argArr.some(val => val != null && val.toLowerCase().indexOf('user') >= 0);
    let includeTimes = argArr.some(val => val != null && val.toLowerCase().indexOf('time') >= 0);
    let historyTxt = getPlayedTracksText(message, tryParseInt(args, defaultTrackCount), includeUsers, includeTimes);
    let historyMsgs = splitTextByLines(historyTxt);
    for (let i = 0; i < historyMsgs.length; i++){
      message.reply(historyMsgs[i]);
    }
  }

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
      .then(msg => client.destroy())
      .then(() => client.login(process.env.client_TOKEN));
  }
  if (command === "say") {
    repeat = args.join(" ");
    message.delete().catch(error => {});
    message.channel.send(repeat);
  }
  if (command === "sol") {
    message.channel.send("Tryna join");
    try {
      message.member.voiceChannel.join();
      message.channel.send("just keep swimming");
    } catch (err) {
      message.channel.send(err);
    }
    message.channel.send("Did it join?");
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
    message.channel.send("prefix has been changed! (" + p + ")");
    client.user.setActivity(p + `help for commands!`);
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
        description: "All of the nifty features of this client!",
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
            value: "!say (message) - Make the client say a message!"
          }
        ]
      }
    });
  }
});
