const Discord = require('discord.js');
const { prefix, token, help, aItems } = require('./config.json');
const Client = new Discord.Client();
const dictSize = 172820;
var letters = require('./letterScores.json');
fs = require('fs');
var patch = JSON.parse(fs.readFileSync('./patch.json').toString());;
var lead = JSON.parse(fs.readFileSync('./lead.json').toString());;

var users = JSON.parse(fs.readFileSync('./data.json').toString());;
var {words} = require('./dict.json');
const { create } = require('domain');



Client.once('ready', () => {
    //sendMes("602097639252557844", "Im now online!!!");
    console.log('Ready!');
    var size = Object.keys(patch).length - 1
    //sendMes("602097639252557844", "Changes: " + patch["latest"]);
    resetLead(lead);
    fs.writeFile('./lead.json', JSON.stringify(lead), function(err, result) {
        if (err) {
            console.log(result);
        }
    });
})

Client.on('message', message =>{

    message.content = message.content.toLowerCase();

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

    if (chanId == "602097639252557800" || chanId == "174718744017371136") {
        chanId = "602097639252557844";
    }

    if (!containsUser("u" + id, users) && id != "601536176310059081") { 
        createUser(id, Client.fetchUser(id).username)
        //message.channel.send("I DONT KNOW WHO YOU ARE, <@" + id + "> . CONTACT hayden IF YOU WANT SOME FUN");
    } else {

        //602097639252557844 autism gen
        //601532160863895555 test
        if (message.content.startsWith(`${prefix}score`)) {
            displayScore(message, chanId, id);
        }
        if (message.content.startsWith(`${prefix}lead`)) {
            resetLead(lead);
            displayLead(chanId, id)
        } 
        if (message.content.startsWith(`${prefix}give`)) {  
            giveCoins(message, chanId, id);
        } 
        if (message.content.startsWith(`${prefix}balance`)) { 
            displayBalance(message, chanId, id) ;
        }
        if (message.content.startsWith(`${prefix}help`)) { 
            displayHelp(chanId, id);
        }
        if (message.content.startsWith(`${prefix}abuy`)) {
            abuy(message, chanId, id);
        } 
        if ((message.content.includes('i am') || message.content.includes('im') || message.content.includes('i\'m')) && id != 601536176310059081) {
            console.log(id)
            cutmsg = ''
            if (message.content.includes('i am')) {
                cutmsg = message.content.substring(message.content.indexOf('i am') + 4)
            } else if (message.content.includes('im')) {
                cutmsg = message.content.substring(message.content.indexOf('im') + 2)
            } else if (message.content.includes('i\'m')) {
                cutmsg = message.content.substring(message.content.indexOf('i\'m') + 3)
            }

            //checks for end
            if (cutmsg.includes('.')) {
                cutmsg = cutmsg.substring(0, cutmsg.indexOf('.'))
            }
            message.channel.send("Hi" + cutmsg+ ", I'm BetterBot!")
        } else {
            var split = message.content.split(" ").join("/").split("/").join(",").split(",").join(".").split(".").join("? ").split("?").join("!").split("!");
            var sentWords = [];
            split.forEach(element => {
                if (element != ' ' && !element.includes("\#") && element != '' && !element.includes("\@") 
                    && !element.includes("\^") && !element.includes("\*") && !element.includes("\&") && !element.includes("\=")
                    && !element.includes("\+") && !element.includes("\-") && !element.includes("\_") && !element.includes("\`")
                    && !element.includes("\~") && !element.includes("\>") && !element.includes("\<") && !element.includes("\^")) {
                    sentWords.push(element);
                }
            });

        
            var total = 0;
            sentWords.forEach(element => {
                total += scoreWord(element.trim(), id);
            });
    
            console.log(users)
            var old = users["u" + id]["count"];
        
            users["u" + id.toString()]["count"] = (total + old);

            fs.writeFile('./data.json', JSON.stringify(users), function(err, result) {
                if (err) {
                    console.log(result);
                }
            });
        }

    

        if (message.channel.type == "dm") {
          sendMes("602097639252557844", "STOP DMING ME,  <@" + id + "> !! YOU FUCKERS THINK THIS IS A JOKE?!? ILL FUCK YOU THE FUCK UP!! hayden WILL BAN YOU!!")
        }
    
        {
             // <@381292363127062538> <@478328100640522240> <@188850569832693771> <@231526337620344833> <@184526452614496256>
             // <@181953688829427712> <@187065062144475136> <@241402151975387160> <@121442868492632067> <@300998279049510914> 
             // <@194332761698467850> <@176018834640207882> <@132996585545007106> <@384892766066442241> <@140656575214780417> 
             // <@212724916888403968> <@193823432578826240> <@140652300766019586> <@335239889085923330> <@494004577948008448>
             // <@191432159792332800> <@205857740780863496> <@170692889871908866> <@170692889871908866> <@232166854762823681>
             // <@128382291507412992> <@302289138906824707> <@244870426801602561> <@237030712174313472> <@127516303069151233>
             // <@191432159792332800>;
        }

    }
});

Client.login(token);

function contains(container, val) {
    return (container[val] != undefined);    
}

function containsUser(val) {
    return users[val] != undefined;
}

function scoreWord(word) {
    var i = word.length;
    var count = 0;
    while (i--) {
        var letter = word.charCodeAt(i);
        
        if (letter >= 65 && letter <= 90) {
            letter -= 65;
            count += letters[parseInt(letter)];
        } else if (letter >= 97 && letter <= 122) {
            letter -= 97;
            count += letters[parseInt(letter)];
        }


    }
    if (words.includes(word)) {
        return Math.floor(count);
    } else {
        return Math.floor(count *-.5);
    }
}

function filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
      return Number(value);
    } else {
      return NaN;
    }
}


function resetLead(currList) {

    for (var i = 0; i < 10; i++) {
        currList[i] = "";
    }

    //walks thru the lead list
    for (var i = 0; i < 10; i++) {
        //initializes the current highest
        var highId = "";
        var highScore = -100000000;
        for (var key in users) {
            var contains = false;
            for(var j = 0; j < 10 && !contains; j++) {
                 if (currList[j] == key) {
                     contains = true;
                 }
            }
            if (users[key]["count"] > highScore && !contains ) {
                highId = key;
                highScore = users[highId]["count"];
            }
        }
        currList[i] = highId;
        list = currList;
    }
}

function displayLead(chanId, useId) {
    var usersArr = [Client.users.get(lead["0"].substring(1)).username,
                Client.users.get(lead["1"].substring(1)).username,
                Client.users.get(lead["2"].substring(1)).username,
                Client.users.get(lead["3"].substring(1)).username,
                Client.users.get(lead["4"].substring(1)).username,
                Client.users.get(lead["5"].substring(1)).username,
                Client.users.get(lead["6"].substring(1)).username,
                Client.users.get(lead["7"].substring(1)).username,
                Client.users.get(lead["8"].substring(1)).username,
                Client.users.get(lead["9"].substring(1)).username];
    for (var i = 0; i < 10; i++) {
        var len = usersArr[i].length;
        var rem = "";
        for(; len < 34; len++) {
            rem += ".";
        }
        usersArr[i] += rem;
    }
    var ndspc  = [];
    for (var i = 0; i < 10; i++) {
        ndspc[i] = "";
        for(var j = 0; j < (10 - users[lead[i + ""]]["count"].toString().length); j++) {
            ndspc[i] += " ";
        }
    }

    
    sendMes(chanId, "<@" + useId + ">\`\`\`diff\n" +
                    "!======================= LEAD =======================!\n" +
                    "+ 1st:  " + usersArr[0] + users[lead["0"]]["count"] + ndspc[0] + " +" +
                    "\n+ 2nd:  " + usersArr[1] + users[lead["1"]]["count"] + ndspc[1]  + " +" +
                    "\n+ 3rd:  " + usersArr[2] + users[lead["2"]]["count"] + ndspc[2]  + " +" +
                    "\n+ 4th:  " + usersArr[3] + users[lead["3"]]["count"] + ndspc[3]  + " +" +
                    "\n+ 5th:  " + usersArr[4] + users[lead["4"]]["count"] + ndspc[4]  + " +" +
                    "\n+ 6th:  " + usersArr[5] + users[lead["5"]]["count"] + ndspc[5]  + " +" +
                    "\n+ 7th:  " + usersArr[6] + users[lead["6"]]["count"] + ndspc[6]  + " +" +
                    "\n+ 8th:  " + usersArr[7] + users[lead["7"]]["count"] + ndspc[7]  + " +" +
                    "\n+ 9th:  " + usersArr[8] + users[lead["8"]]["count"] + ndspc[8]  + " +" +
                    "\n+ 10th: " + usersArr[9] + users[lead["9"]]["count"] + ndspc[9]  + " +" +
                    "\n!====================================================!`\`\`");
}

function displayScore(message, chanId, useId) {
    if (message.mentions.users.size > 0) {
        var ment = "u" + message.mentions.users.firstKey();
        ment in users ? sendMes(chanId, "<@" + useId + ">\`\`\` " +  message.mentions.users.first().username + "'s score: " + users[ment]["count"] + 
                                "\`\`\`" ) : sendMes(chanId, "<@" + useId + ">" + message.mentions.users.first().username + " isnt having fun right " + 
                                "now... come back later and they might be added into the fun. (DM hayden for more information)");    
    } else {
        sendMes(chanId, "<@" + useId + ">\`\`\` " + message.author.username + "'s Score: " + users["u" + useId]["count"] + "\`\`\`" );
    }
}


function displayHelp(chanId, useId) {

    var msg = "<@" + useId + ">\n\`\`\`diff\n"
    msg += "!=============================== COMMANDS ===============================!\n";
    help.forEach(element => {
        var spacing = "";
        for(var i = element.length; i < 71; i++) {
            spacing += " "
        }
        msg += "+ " + element + spacing + "+\n";
    });
    msg += "!========================================================================!";
    msg += "\`\`\`";
    Client.channels.get(chanId).send(msg); 

}




function sendMes(chanId, str) {
    console.log(chanId)
    Client.channels.get(chanId).send(str);
}




function createUser (id, name) {
    var users = JSON.parse(fs.readFileSync('./data.json').toString());
    console.log(users[id])
    newUser = {
        "name": name,
        "biggest": "a",
        "best": 1,
        "count": 0
    }
    users["u" + id] = newUser;
    fs.writeFile('./data.json', JSON.stringify(users), function(err, result) {
        if (err) {
            console.log(result);
        }
    });
    
}