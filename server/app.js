const express = require('express');
const fs = require('fs');
const app = express();

var entries = ["Agent","Time","Method","Resource","Version","Status"];
fs.writeFile("server/log.csv",entries.join(",") + "\n", function(err) {
    if (err) console.log("Error Creating log file: "+err);
    });

app.use((req, res, next) => {

    var newEntry = [];
    newEntry.push(req.header("user-agent"));
    newEntry.push((new Date()).toISOString());
    newEntry.push(req.method);
    newEntry.push(req.path);
    newEntry.push("HTTP/"+req.httpVersion); //Don't ask how I found this...
    newEntry.push(200) //Assumption for simplicity
    console.log(newEntry.join(","));

    fs.appendFile("server/log.csv",newEntry.join(",")+"\n", function(err) {
        if (err) console.log("Error writing log file: "+err);
        });

    //For some reason, everything freezes here if I don't include this call
    next();
});

app.get('/', (req, res) => {
    res.send("ok").end();
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    var file = fs.readFile("server/log.csv",function(err, data) {
        var result = [];
        var textLines = data.toString().split("\n");
        var fields = textLines[0].split(",");
        for (var i = 1; i < textLines.length-1; i++) {
            var entry = {};
            fields.forEach(function(el,idx) {
                entry[el] = textLines[i].split(",")[idx];
            });
            result.push(entry);
        }
        res.send(result).end();
    });
});

module.exports = app;
