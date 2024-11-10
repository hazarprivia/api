var token = "" //write your bot token here

const {Client, GatewayIntentBits, Partials} = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const bot = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});


bot.on('ready', () => {
  	console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageCreate', (message) => {
	let msgArray = message.content.split(" ");
	let command = msgArray[0]; // Gets the first element of msgArray and removes the prefix
    let args = msgArray.slice(1); // Remove the first element of msgArray/command and this basically returns the arguments
    var wws = 0;
    if (command == "!help") {
    	const e = new EmbedBuilder()
	          .setColor(0x0099FF)
	          .setTitle('Help page')
	          .setURL('https://google.com/')
	          .setDescription('All commands')
	          .addFields(
		          { name: '!friend', value: 'send friend request to player\nExp: !friend #[tag]' },
		          { name: '!credit', value: '🙃' },
		          { name: '!spectate', value: 'send viewers to player\nExp: !spectate #[tag] [number]' },
	           )
	           .setTimestamp();
	    return message.channel.send({ embeds: [e] });
	//{ name: '!spectate', value: 'send viewer in battle\nExp: !spectate #[tag] [viever count]' },
    }
    
    if (command == "!credit") {
    	const e = new EmbedBuilder()
	          .setColor(0x0099FF)
	          .setTitle('Credits page')
	          .addFields(
		          { name: 'github.com/HaccerCat', value: 'I used a small part of the code ' },
		          { name: 'github.com/antzsmt', value: 'tag2id 🙃' },
		          { name: 'github.com/DemirCnq', value: 'Owner' },
	           )
	           .setTimestamp();
	    return message.channel.send({ embeds: [e] });
    }
    
	if (command == "!friend") {
		if(!args[0]) return message.channel.send('wrong usage! \n example usage: !friend #U8PG8P22.');
		if(!args[0].startsWith("#")) return message.channel.send('Wrong tag! \n example usage: !friend #U8PG8P22.');
		
		if(args[0].startsWith("#")){
			var tag = new GetID(args[0]);
            var h = tag[0],
            l = tag[1];
            wws = 1;
            
            name = null;

            if (wws == 1) {
            	for(var i = 0; i <= 20; i++) {
                     new Start(message, h,l, wws);
                }
            }
            message.channel.send("Friend requests are sended");
            return message.channel.send('Tag: '+ args[0] +'\nHigh ID: '  + h +'\nLow ID: '+ l);
		}
	}
	
	if (command == "!spectate") {
		if(!args[0]) return message.channel.send('wrong usage! \n example usage: !spectate #[tag] [number].');
		if(!args[0].startsWith("#")) return message.channel.send('Wrong tag! \n example usage: !spectate #[tag] [number].');
		if(!args[1]) return message.channel.send('You need the write viewer count');
		if(args[1] > 500) return message.channel.send('viewer count can be between 1 and 500');
		if(args[0].startsWith("#")){
			var tag = new GetID(args[0]);
            var h = tag[0],
            l = tag[1];
            wws = 2;
            
            message.channel.send("viewers are sending");
            message.channel.send("wait a minute");
            message.channel.send('Tag: '+ args[0] +'\nHigh ID: '  + h +'\nLow ID: '+ l);
            if (args[1] < 500) {
            	for(var i = 0; i <= args[1]-1; i++) {
                     new Start(message, h,l, wws);
                }
            }
		}
	}
});

bot.login(token);

var net = require("net");
var {
    Queue,
    Messaging
} = require("./Messaging/Messaging");
class Start {
	constructor(msg,h,l, wws) {
		var client = new net.Socket();

        var host = "game.brawlstarsgame.com";
        var port = 9339

        client.connect(parseInt(port), host, () => {
              console.log(`Connected the server: ${host}:${port}`);
              var queue = new Queue();
              var messaging = new Messaging(client, queue,h,l, wws);
    
              messaging.sendPepperAuthentication();
    
              client.on("data", data => {
                  queue.add(data);
                  while (messaging.pendingJob()) {
                        messaging.update();
                  }
              });
             client.on("close",
             () => {
                    console.log("connection closed");
                 });
          });

        client.on("error", error => {
              console.log(error);
        });
	}
}

const Long = require('long')
class GetID {
	constructor(tag) {
		var tagChars = '0289PYLQGRJCUV'
		tag = tag.slice(1);
		if (tag === undefined || typeof tag !== 'string') return false
        
        let id = 0
        let tagArray = tag.split('')
        for (let a = 0; a < tagArray.length; a++) {
           let i = tagChars.indexOf(tagArray[a])
           id *= tagChars.length
           id += i
        }
        let high = id % 256
        let low = Long.fromNumber((id - high)).shiftRight(8).low

		var HighLow = [];
		HighLow.push(high);
		HighLow.push(low);
		
		return HighLow;
		}
	}

