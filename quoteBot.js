const Discord = require('discord.js');
const { prefix, token, help, aItems } = require('./config.json');
const Client = new Discord.Client();
const fs = require('fs')


Client.once('ready', () => {
    //sendMes("602097639252557844", "Im now online!!!");
    console.log('Ready!');
    var quotes = require('./quotes.json')
})

Client.on('message', message => {

    var quotes = require('./quotes.json')
   
    user = message.author.username
    //channel type
    var id = 0;
    var chanId = 0;
    if (message.channel.type == "dm") {
        id = message.channel.recipient.id;
        console.log("u" + id + " said in a dm: " + message.content);
        chanId = "602097639252557844"
    } else {
        id = message.member.user.id;
        console.log("u" + id + " said: " + message.content);
        chanId = message.channel.id
    }

    if (chanId == 174718744017371136) {
        chanId = "602097639252557844";
    }
    
    //602097639252557844 autism gen
    //601532160863895555 test
    if (message.content.toLowerCase().startsWith(`${prefix}quote`)) {
        qnum = Math.floor(Math.random() * Object.keys(quotes).length)
        if (quotes[qnum]["q"].startsWith("|")) {
            q =  quotes[qnum]["q"]  + "\n-" + quotes[qnum]["a"]
        } else {
            q = "|   _" + quotes[qnum]["q"] + "_\n-" + quotes[qnum]["a"]
        }
        console.log(chanId)
        sendMes("" + chanId, q)

    } else {
            parts = message.content.split("\n")
            for (i = 0; i < parts.length; i++) {
                parts[i] = "|   " + parts[i]
            }
            console.log(parts)
            message.content = parts.join('\n')
            quotes[Object.keys(quotes).length] = {
                "q": message.content,
                "a": user
            }
            fs.writeFileSync("./quotes.json", JSON.stringify(quotes, null, 3))
        
    }


    if (message.channel.type == "dm") {
        sendMes("602097639252557844", "STOP DMING ME,  <@" + id + "> !! YOU FUCKERS THINK THIS IS A JOKE?!? ILL FUCK YOU THE FUCK UP!! hayden WILL BAN YOU!!")
    }
});

Client.login(token);

function sendMes(chanId, str) {
    Client.channels.get(chanId).send(str);
}
