var builder = require('botbuilder');
var bankQna = require('./ExchangeRateCard');


exports.startDialog = function (bot ) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/469a246a-744d-4e83-90fd-f6c70ee587bb?subscription-key=023f5cf1ce4146dc98a17db245ad72b1&verbose=true&timezoneOffset=720&q=');

    bot.recognizer(recognizer);

    // Show what the customer wants to know about
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

    // Delete added favourite from the list
    bot.dialog('DeleteFavourite', [
        // Insert delete logic here later
    ]).triggerAction({
        matches: 'DeleteFavourite'

    });

    // 
    bot.dialog('GetFavourites', [
       // Insert favourite logic here later
    ]).triggerAction({
        matches: 'GetFavourites'
    });

    // Add a favourite on the list
    bot.dialog('AddFavourite', [
        // Insert logic here later
    ]).triggerAction({
        matches: 'AddFavourite'
    });
    
    // Greeting word or sign of welcome
    bot.dialog('WelcomeIntent', [
        // Insert logic here later
    ]).triggerAction({
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