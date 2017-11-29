var builder = require('botbuilder');
var exchangeRate = require('./ExchangeRateCard');
var connData = require("./connDatabase");
var qMaker = require("./QnAMaker")

exports.startDialog = function (bot ) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/446a5e2d-ac30-4b55-bb26-295de4c7aab0?subscription-key=4a0669ef12b645fe846261145aba9ffc&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove currency from the currency database
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('UpdateBaseCurrency', function (session, args) {
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Please say 'hello' or 'login' to set your base currency.");
        } else {
            session.send("Do you want to update this base currency to Database?");
            // Pulls out the currency entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'rates');

            // Checks if the for entity was found
            if (currencyEntity) {
                session.send("Updating \"%s\"...", currencyEntity.entity);
                connData.updateSavedCurrency(session,session.conversationData['username'],currencyEntity.entity);
                session.send("Your base currency is now updated to \"%s\".", currencyEntity.entity.toUpperCase());
            } else {
                session.send("No currency identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'UpdateBaseCurrency'
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Set currency on the currency database
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('SetBaseCurrency', function (session, args) {
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Please say 'hello' or 'login' to set your base currency.");
        } else {
            // Pulls out the currency entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'rates');
            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Thanks for telling me that \'%s\' is now set as your base currency.', currencyEntity.entity.toUpperCase());
                connData.setUserCurrency(session,session.conversationData['username'],currencyEntity.entity); //<--- CALLL WE WANT
                //connData.setUserCurrency("nzd", currencyEntity.entity, session);
            } else {
                session.send("No currency identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'SetBaseCurrency'
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Get base currency from DB
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('ShowBaseCurrency', function (session, args) {
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Please say 'hello' or 'login' to set your base currency.");
        } else {
                session.send("Retrieving your saved currency from DB.");
                connData.displaySavedCurrency(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED             
        }
    }).triggerAction({
        matches: 'ShowBaseCurrency'
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Show exchange rate using fixer API 
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('ShowCurrency', function (session, args) {
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Please say 'hello' or 'login' to set your base currency.");
        } else {
            // Pulls out the food entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'rates');

            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Looking for exchange rates of %s...', currencyEntity.entity.toUpperCase());
                exchangeRate.displayExchangeRateCards(session.conversationData["currency"], currencyEntity.entity, session);
            } else {
                session.send("No currency identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'ShowCurrency'
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Login - Setup an account with username
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('WelcomeIntent', [
        function (session, args, next) {
            session.dialogData.args = args || {};    
            if (!session.conversationData["username"]) {
                //session.send("Welcome to join Contoso Bank.");
                builder.Prompts.text(session, "Please enter your username to retrieve your previous information."); 
            } else {
                session.send("Hi! "+session.conversationData["username"]+", You have already logged in.");
                next();
            }
        },
        function(session, results, next){
            if(results.response){
                session.conversationData["username"] = results.response;
                connData.displaySavedCurrency(session, session.conversationData["username"]);
            }
        },
    ]).triggerAction({
        matches: 'WelcomeIntent'
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Logout - Clear username
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('LogoutIntent',
        function (session, args, next) {
            session.dialogData.args = args || {};    
            if (!session.conversationData["username"]) {
                session.send("You are not logged in, yet!");
            } else {
                session.conversationData["username"] = null;
                session.send("Thank you for using Contoso Bot. \n You have now logged out.");
            }
    }).triggerAction({
        matches: 'LogoutIntent'
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Help - Show simple commands 
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('CustomerHelp', function (session, args) {
            session.send("[Simple Commands]");
            session.send("Show Base Currency: Show/what's my base currency.");
            session.send("Set Base Currency: Set NZD as my base currency.");
            session.send("Update Base Currency: Update my base currency to USD.");
            session.send("Exchange Rates: What's the rate for NZD?");
    }).triggerAction({
        matches: 'CustomerHelp'
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Q&A - Questions and Answers using MS QnA cognitive
    //////////////////////////////////////////////////////////////////////////////////////////////////
    bot.dialog('QnaIntent', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            builder.Prompts.text(session, "How may I help you?");
        },
        function (session, results, next) {
            qMaker.talkToQnA(session, results.response);
        }
    ]).triggerAction({
        matches: 'QnaIntent'
    });

    // Function is called when the user inputs an attachment
    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            
            //call custom vision here later
            return true;
        }
        else {
            return false;
        }
    }
}