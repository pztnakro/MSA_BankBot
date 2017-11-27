var rest = require('../API/Bankclient');
var builder = require('botbuilder');

//Calls 'getExchangeRate' in ExchangeRateCard.js with 'displayExchangeRateCards' as callback to get list of exchange rates
exports.displayExchangeRateCards = function getExchangeRate(baseCurrency, targetCurrency, session){
    //var url ='https://api.yelp.com/v3/businesses/search?term='+foodName+'&location='+location + '&limit=5';
    //var auth ='cO92idzWqWjpOsV8RdAoB2DZl2GW8OE8pvoTlOjNNI0gbA2J7xXuiAPtLAYCkPCKR-dIXG3ePsSI4ngt8WRNQ4q4RlKMdXyvJr6r4_L3kndI5wpznLN6WUrPmgDYWXYx';
    var url ='https://api.fixer.io/latest?base='+baseCurrency+'&symbols='+targetCurrency;
    rest.getExchangeRate(url,session,displayExchangeRateCards);
}

function displayExchangeRateCards(message, session) {
    var attachment = [];
    var restaurants = JSON.parse(message);
    
    //For each restaurant, add herocard with name, address, image and url in attachment
    for (var index in restaurants.businesses) {
        var restaurant = restaurants.businesses[index];
        var name = restaurant.name;
        var imageURL = restaurant.image_url;
        var url = restaurant.url;
        var address = restaurant.location.address1 + ", " + restaurant.location.city;

        var card = new builder.HeroCard(session)
            .title(name)
            .text(address)
            .images([
                builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, 'More Information')
            ]);
        attachment.push(card);

    }

    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}