var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');
// Some sections have been omitted

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "99984d2b-e5d4-4577-98a8-abee95808c86", //process.env.MICROSOFT_APP_ID,
    appPassword: "pjnhvcDVY59401[-{vOGLJ:" //process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {

    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);