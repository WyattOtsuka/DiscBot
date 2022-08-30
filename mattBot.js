const Discord = require('discord.js');
const { prefix, token, help, base, channels, loseLimit, minerId, kill } = require('./config.json');
const Client = new Discord.Client()
const fs = require('fs');
const { type } = require('os');
var count = base;
var robot = require('kbm-robot');
var typing = false;
var consecLoses = 0;
var wins = 0;
var loses = 0;
var spent = 0;
var gained = 0;
var bought = 0;
robot.startJar();

var buy = process.argv[2].includes("buy")

Client.once('ready', () => {
    console.log('Ready!\n\n\n\n\n');
    if (buy) {
        process_buy();
    }
})

// KNOWN BUGS
// - Bot will react to messages from other people's calls
// - Bot doesn't always call the slash command
Client.on('message', message => {
    //      if it was a win
    //          reset to base bet
    //      else
    //          double the antie
    if (message.author.id == 744883471004205147) { // Check if the message is from the bot
        if (buy) {
            process_buy();
        } else {
            delay(500).then(() => {
                process_message(message, 0);
            });
        }
    }
    if ((message.author.id == 601586137299025967 || message.author.id == 242839149806092289)) { //me and matt -> RCTR, MattBot
        if (message.content.includes("/slots")) {
            process.stdout.moveCursor(0, -6)
            typeMsg("/slots amount:" + (Math.round(count * 100) / 100 + "k "), true)
        } else if ((channels.includes(message.channel.id) && message.content.includes(kill))) {
            console.log("Bot manually Stopped");
            throw new Error("Bot manually stopped");
        }
    }
});

function process_message(message) {
    try {
        // If broke assume loss
        broke = message == undefined;
        if (!broke) {
            broke = message == undefined;
            if (!broke) {
                broke = message.embeds == undefined;
                if (!broke) {
                    broke = message.embeds[0] == undefined;
                    if (!broke) {
                        broke = !message.embeds[0].hasOwnProperty("description")
                    }
                }
            }
        }

        if (broke || message.embeds[0]["description"].includes("lost")) {
            loses++;
            spent += Math.round(count * 100) / 100 * 1000;
            count *= 1.05;
            consecLoses += 1;
            if (consecLoses >= loseLimit) {
                count = base;
                consecLoses = 0;
            }
        } else if (message.embeds[0]["description"].includes("won")) { // win, then reset to base
            wins++;
            gained += Math.round(count * 100) / 100 * 9000;
            count = base;
            consecLoses = 0;
        } else {
            throw new Error("YOUR OUT OF MONEY LOSER!");
        }

        process.stdout.moveCursor(0, -4)
        process.stdout.write("\rWins:\t\t" + wins);
        process.stdout.write("\nLoses:\t\t" + loses);
        process.stdout.write("\nProfit:\t\t" + (gained - spent) + "                ");
        process.stdout.write("\nWin %:\t\t" + Math.round((wins * 10000 / (wins + loses)) / 100) + "%       ")
        process.stdout.write("\n$ per roll:\t" + Math.round((gained - spent) * 100 / (wins + loses)) / 100 + "            ")

        if (!typing) {
            typing = true;
            delay(1700).then(() => {
                typeMsg("/slots amount:" + (Math.round(count * 100) / 100 + "k "), double = true);
                typing = false;
            });
        } else {
            delay(5000).then(() => {
                Client.on('message', message);
            });
        }
    } catch (e) {
        if (e instanceof TypeError) {
            console.log(e)
            count = base;
            consecLoses = 0;
            if (!typing) {
                typing = true;
                delay(1700).then(() => {
                    typeMsg("/slots amount:" + (Math.round(count * 100) / 100 + "k "), double = true);
                    typing = false;
                });
            } else {
                delay(5000).then(() => {
                    Client.on('message', message);
                });
            }
        } else {
            throw e;
        }
    }
}

function process_buy() {
    delay(2750).then(() => {
        typeMsg("/buy", " id:" + minerId + " ", true);
        bought++;
        process.stdout.moveCursor(0, -1)
        console.log('\rBought ' + bought + ' minors this session')
    });
}

Client.login(token);


function typeMsg(str, str2 = "", double = false) {
    if (double) {
        if (str2 != "") {
            robot.typeString(str, 10, 10)
                .sleep(250)
                .typeString(str2, 10, 10)
                .sleep(250)
                .press("enter")
                .sleep(150)
                .release("enter")
                .sleep(450)
                .press("enter")
                .sleep(150)
                .release("enter")
                .go();
        } else {
            robot.typeString(str, 10, 10)
                .sleep(250)
                .press("enter")
                .sleep(150)
                .release("enter")
                .sleep(450)
                .press("enter")
                .sleep(150)
                .release("enter")
                .go();
        }
    } else {
        if (str != "") {
            robot.typeString(str, 10, 10)
                .sleep(250)
                .typeString(str2, 10, 10)
                .sleep(200)
                .press("enter")
                .sleep(200)
                .release("enter")
                .go();
        } else {
            robot.typeString(str, 10, 10)
                .sleep(200)
                .press("enter")
                .sleep(200)
                .release("enter")
                .go();
        }
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}