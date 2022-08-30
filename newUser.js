const { Client } = require("discord.js");

var CREATEUSER = CREATEUSER || function(id, name) {
    var users = JSON.parse(fs.readFileSync('./data.json').toString());

    newUser = {
        "name": name,
        "biggest": "a",
        "best": 1,
        "count": 0,
        "coins": 0,
        "mult": 100
    }

    
    
    users[id] = newUser;
    fs.writeFile('./data.json', JSON.stringify(users), function(err, result) {
        if (err) {
            console.log(result);
        }
    });








}