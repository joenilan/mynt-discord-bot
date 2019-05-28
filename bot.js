// Load up the discord.js library
const Discord = require("discord.js");
const axios = require('axios');

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `client.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./secrets.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

// Load other Modules
// require("./modules/swiftex.cmd.js");
// const Files = require('fs');

// client.modules = [];
// Files.readdir('./modules/', (err, files) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }
//   console.log("Loading modules...");
//   console.log(" ");
//   files.forEach((file, index) => {
//     if (file.endsWith('.cmd.js')){
//     console.log(file);
//     client.modules.push(require('./modules/' + file));
//     }
//   });
//   console.log("Finished.");
//   console.log(" ");
// });

// Update bot Status
function updatePresence() {
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
//   let guilds = client.guilds ? client.guilds.array().length : 0;
//   client.user.setPresence({
//     status: 'online',
//     game: {
//       name: `in ${guilds} guild${guilds === 1 ? '' : 's'} | ${
//         config.prefix
//       }help`
//     }
//   });
}

client.on("ready", () => {
  console.log("");
  console.log("███╗   ███╗██╗   ██╗███╗   ██╗████████╗ ██████╗ ███████╗");
  console.log("████╗ ████║╚██╗ ██╔╝████╗  ██║╚══██╔══╝██╔═══██╗██╔════╝");
  console.log("██╔████╔██║ ╚████╔╝ ██╔██╗ ██║   ██║   ██║   ██║███████╗");
  console.log("██║╚██╔╝██║  ╚██╔╝  ██║╚██╗██║   ██║   ██║   ██║╚════██║");
  console.log("██║ ╚═╝ ██║   ██║   ██║ ╚████║   ██║   ╚██████╔╝███████║");
  console.log("╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚══════╝");
  console.log("");
  client.guilds.forEach((guild) => {
    console.log('Connected to ' + guild.name)
    });
  console.log("Connected as: " + client.user.tag)
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  console.log("===============================================================");
  client.guilds.forEach((guild) => {
    guild.channels.forEach((channel) => {
    console.log(` - ${channel.name} ${channel.type} [${channel.id}]`)
  })
});
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  updatePresence();


});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'bot-logs');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  //if(message.content.indexOf(config.prefix_crypto) !== 0) return;
  if(message.content.indexOf(config.prefix) !== 0){
  } else if(message.content.indexOf(config.prefix_crypto) !== 0){
  };

  const args_crypto = message.content.slice(config.prefix_crypto.length).trim().split(/ +/g);
  const command_crypto = args_crypto.shift().toLowerCase();

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //if(command_crypto === "price" + coin.slice(2,7)) {
  if(command_crypto === "price") {
    
    if(message.content.startsWith(config.prefix)) {

    } else if(message.content.startsWith(config.prefix_crypto)) {
      // console.log("Args1: " + args)
      // console.log("Args2: " + command_crypto+args)
      // console.log("Args3: " + config.prefix_crypto+command_crypto+" "+args)
      var coins = ["mynt",
       "aus",
       "oasis",
       "slice",
       "odin",
       "rito",
       "pown"];
      // var result = coins.includes(args)
      if (coins.includes(args.toString())) {
                axios.all([
                  axios.get('https://swiftex.co/api/v2/tickers'),
                  axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
                ]).then(axios.spread((response1, response2) => {
                  price = response1.data[args.toString()+'-btc']['ticker']['last']
                  bitcoin_price = response2.data['bitcoin']['usd']
                  total_price = Number(price) * Number(bitcoin_price)
                  client.channels.get("575569258046554112").send("$"+total_price.toFixed(9))
                  //console.log(bitcoin_price)
                  //console.log(price)
                  //console.log(total_price)
                  
                })).catch(error => {
                  console.log(error);
                });
      } else if (args.toString() == "btc"){

                axios.all([
                  axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
                ]).then(axios.spread((response1) => {
                  bitcoin_price = response1.data['bitcoin']['usd']
                  client.channels.get("575569258046554112").send("$"+bitcoin_price)
                  //console.log(bitcoin_price)
                  //console.log(price)
                  //console.log(total_price)
                  
                })).catch(error => {
                  console.log(error);
                });
            
      } else if (args.toString() == "eth"){
       
        axios.all([
          axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        ]).then(axios.spread((response1) => {
          ether_price = response1.data['ethereum']['usd']
          client.channels.get("575569258046554112").send("$"+ether_price)
          //console.log(bitcoin_price)
          //console.log(price)
          //console.log(total_price)
          
        })).catch(error => {
          console.log(error);
      });


      } else {
        console.log("NAH")
      }


      // const channel = member.guild.channels.find(ch => ch.name === 'bot-logs');
      // // Do nothing if the channel wasn't found on this server
      // if (!channel) return;
      // // Send the message, mentioning the member
      // channel.send(`this will be price shit`);
      //console.log(config.crypto_prefix+coin.slice(2,7))
      //console.log(command_crypto)
      //console.log(message.content)
      //console.log(coins)
  
    }
  }  
  
  if(command === "help") {
  const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Myntos - The freshmaker', 'https://getmynt.io/wp-content/uploads/2019/01/mynt-logo.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://getmynt.io/wp-content/uploads/2019/01/mynt-logo.png')
	.addField('Regular field title', 'Some value here')
	.addBlankField()
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://getmynt.io/wp-content/uploads/2019/01/mynt-logo.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://getmynt.io/wp-content/uploads/2019/01/mynt-logo.png');

    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    // const m = await message.channel.send("help?");
    // m.edit(`shit goes here? ${m.createdTimestamp - message.createdTimestamp}ms.`);
    message.channel.send('```test```');
    message.channel.send(exampleEmbed);
  }

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Big Man"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    const channel = member.guild.channels.find(ch => ch.name === 'bot-logs');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);