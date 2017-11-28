var builder = require('botbuilder');
var exchangeRate = require('./ExchangeRateCard');
var connData = require("./connDatabase");


exports.startDialog = function (bot ) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/469a246a-744d-4e83-90fd-f6c70ee587bb?subscription-key=023f5cf1ce4146dc98a17db245ad72b1&verbose=true&timezoneOffset=720&q=');

    bot.recognizer(recognizer);

    // Show what the customer wants to know about (QnA)
    bot.dialog('WannaKnowAbout', function (session, args) {
        // Pulls out the customer's inquiry entity from the session if it exists
        var inquiryEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'inquiry');

        // Checks if the inquiry entity was found
        if (inquiryEntity) {
            session.send('Looking for inquiries which relevant %s...', inquiryEntity.entity);
            // Insert logic here later
        } else {
            session.send("No inquiry identified! Please try again");
        }

    }).triggerAction({
        matches: 'WannaKnowAbout'
    });

    // Remove currency from the currency database
    bot.dialog('UpdateBaseCurrency', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your name to update your base currency.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {

            // Add this code in otherwise your username will not work.
            if(results.require) {
                session.conversationData["username"] = results.response;
            }

            session.send("Do you want to update this base currency to Database?");

            // Pulls out the currency entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Updating \'%s\'...', currencyEntity.entity);
                connData.updateSavedCurrency(session,session.conversationData['username'],currencyEntity.entity);
                session.send('Base currency is updated.');
            } else {
                session.send("No currency identified! Please try again");
            }
        }
    ]).triggerAction({
        matches: 'UpdateBaseCurrency'
    });

    // Set currency on the currency database
    bot.dialog('SetBaseCurrency', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your name to setup your base currency.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            // Add this code in otherwise your username will not work.
            if(results.require) {
                session.conversationData["username"] = results.response;
            }

            // Pulls out the currency entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');
            
            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Thanks for telling me that \'%s\' is now set as your base currency.', currencyEntity.entity);
                connData.setUserCurrency(session,session.conversationData['username'],currencyEntity.entity); //<--- CALLL WE WANT
                //connData.setUserCurrency("nzd", currencyEntity.entity, session);
            } else {
                session.send("No currency identified! Please try again");
            }
        }
    ]).triggerAction({
        matches: 'SetBaseCurrency'
    });

    // Get base currency from DB
    bot.dialog('ShowBaseCurrency', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your name to retrieve your base currency from DB.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your saved currency from DB.");
                connData.displaySavedCurrency(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    ]).triggerAction({
        matches: 'ShowBaseCurrency'
    });

    // Show exchange rate using fixer API 
    bot.dialog('ShowCurrency', [
    
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter your name to retrieve your base currency from DB.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }
            // Pulls out the food entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Looking for exchange rates of %s...', currencyEntity.entity);
                exchangeRate.displayExchangeRateCards("NZD", currencyEntity.entity, session);
                //exchangeRate.displayExchangeRateCards("nzd", "USD", session);
            } else {
                session.send("No currency identified! Please try again");
            }
        }
    ]).triggerAction({
        matches: 'ShowCurrency'
    });
    
    // Greeting word or sign of welcome
    bot.dialog('WelcomeIntent', function (session, args) {
        
        session.send("Welcome to join Contoso Bank. \n How may I help you today?");
    
    }).triggerAction({
        matches: 'WelcomeIntent'
    });
}

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