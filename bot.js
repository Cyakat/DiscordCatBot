const Commando = require('discord.js');
var auth = require('../cat.json');
var fs = require('fs');
var aryChannelIDs;
var math = require('math');
var totalMeows;
const bot = new Commando.Client({
   token: auth.token,
   autorun: true
 });

 bot.login(auth.token);

 bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});
readChannelIDs();
console.log(aryChannelIDs);
nextMeow = nextRandomMeow();
console.log(nextMeow);


bot.on('message', msg =>
{
  var channel = msg.channel;
  var i = 0;
  var user = msg.author.id;
  var username = msg.author.username;
  var channelID = msg.channel.id;
  var userID;
  var content = msg.content;

  content = content.toLowerCase();
  if(content.includes('auggie'))
  {
    msg.channel.send('Meow', { tts: true});
    addToMeowCount(msg);
  }
  if (content === 'auggie add channel')
  {
    addChannelToList(msg.channel.id);
  }
  if (content === 'auggie meows')
  {
    getTotalMeows(msg);
  }

  nextMeow = timeToMeow(nextMeow, msg);

});


function getDate()
{
  var d = new Date();
  var time = d.getTime();
  var seconds = 1000;
  var minutes = seconds * 60;
  var hours = minutes * 60;
  var days = hours * 24;
  var years = days * 365;

  return time;
}

function nextRandomMeow()
{
  var date = getDate();
  randomTime = math.floor(math.random(date) * 86400000 - (86400000/4)) + 86400000/4;
  nextMeow = date + randomTime;

  return nextMeow;
}

function timeToMeow(nextMeow, msg)
{
  var date = getDate();

  if(date > nextMeow)
  {
    sendToAllChannels('Meow');
    nextMeow = nextRandomMeow();
    console.log(nextMeow);
    addToRandomMeowCount(msg);

  }
  return nextMeow;
}

function not(boolean)
{
	if(boolean == true)
	{
		boolean = false;
	}
	else
	{
		boolean = true;
	}
	return boolean;
}

function isWithin(inputNum, targetNum, offset)
{
	var isBetwixt;
	isBetwixt = not(((inputNum >= targetNum - offset) && (inputNum <= targetNum + offset)) || ((inputNum <= -targetNum + offset) && (inputNum >= -targetNum - offset)));
	return isBetwixt;
}

function sendToAllChannels(text)
{
  for (var i = 0; i < aryChannelIDs.length; i++)
  {
    bot.channels.get(aryChannelIDs[i]).send(text);
  }
}

function addToRandomMeowCount()
{
  fs.readFile('./RandomMeows.txt' , (err,data) => {
    if (err) throw err;

    data = data.toString();
    data = data.replace(/\n/, '');
    data = data.replace(/\r/, '');
    randMeows = parseInt(data);

    console.log(randMeows);
    fs.writeFile('./RandomMeows.txt', randMeows+1, (err, data) => {
      if (err) throw err;
    });
  });
}

function readChannelIDs() {
  fs.readFile('./ChannelIDs.txt' , (err,data) => {
  if (err) throw err;

  data = data.toString();
  data = data.replace(/\n/, '')
  data = data.replace(/\r/, '')
  aryChannelIDs = data.split(',');

  console.log('Channels Loaded');
  //console.log(aryChannelIDs);
  return aryChannelIDs;

  });
}

function writeChannelIDs() {
  fs.writeFile('./ChannelIDs.txt' , aryChannelIDs, (err,data) => {
      if(err) throw err;
      console.log('Channels Written')
      //console.log(aryChannelIDs);
      readChannelIDs();
      indexChan = aryChannelIDs.length-1;
  });
  return aryChannelIDs;
}

function addChannelToList(channelID, msg)
{
  var channelExists = false;
  readChannelIDs();
  for (var i = 0; i < aryChannelIDs.length; i++)
  {
    if (channelID === aryChannelIDs[i])
    {
      channelExists = true;
    }
  }
  if (!channelExists)
  {
    aryChannelIDs[aryChannelIDs.length] = channelID;
    writeChannelIDs();
  }
}

function checkChannels()
{
  console.log('Checking Channels')
  for (var i = 0; i < aryChannelIDs.length; i++)
  {
    console.log(aryChannelIDs[i]);
    console.log(i);
    channelExists = bot.channels.get(aryChannelIDs[i]) === undefined;
    console.log(channelExists);
    if (channelExists)
    {
      for (var o = i; o < aryChannelIDs.length-1; o++)
      {
        console.log(aryChannelIDs);
        aryChannelIDs[o] = aryChannelIDs[o+1];
      }
    }
  }
  writeChannelIDs();
}

function getTotalMeows(msg)
{
  fs.readFile('./Meows.txt', (err, data) => {
    if (err) throw err;
    meows = data;
  });

  fs.readFile('./RandomMeows.txt', (err, data) => {
    if (err) throw err;
    data = data.toString();
    console.log(data);
    data = data.replace(/\n/, '')
    data = data.replace(/\r/, '')
    randMeows = data;
    console.log(randMeows);

    msg.channel.send('I have randomly meowed ' + randMeows + ' times and ' + meows + ' times normally!');

  });
}

function addToMeowCount(msg)
{
  fs.readFile('./Meows.txt' , (err,data) => {
    if (err) throw err;

    data = data.toString();
    data = data.replace(/\n/, '');
    data = data.replace(/\r/, '');
    meows = parseInt(data);

    console.log(meows);
    fs.writeFile('./Meows.txt', meows+1, (err, data) => {
      if (err) throw err;
    });
  });
}
