var bankApi = require('../API/Bankclient');
var builder = require('botbuilder');

//Calls 'getExchangeRate' in ExchangeRateCard.js with 'displayExchangeRateCards' as callback to get list of exchange rates
exports.displayExchangeRateCards = function getExchangeRate(baseCurrency, targetCurrency, session){
    var url ='https://api.fixer.io/latest?base='+baseCurrency+'&symbols='+targetCurrency.toUpperCase();
    bankApi.getExchangeRate(url,session, baseCurrency, targetCurrency, displayExchangeRateCards);
}

function displayExchangeRateCards(message, bCurrency, tCurrency,session){
    //Parses JSON
    var exRates = JSON.parse(message);

    //Adds first 5 currency information onto list
    var taCur = tCurrency.toUpperCase().toString();
    var currList = exRates.rates.taCur;
    //var currList = exRates.rates.AUD;
    var searchDate = exRates.date;
    var currencyItems = [];

    for(var i = 0; i < 1; i++){
        var currItems = {};
        currItems.title = "Base Currency: "+bCurrency.toUpperCase().toString();
        currItems.value = currList;
        //currItems.value = currList.toString();
        currencyItems.push(currItems);
    }

    //Displays exchange rate cards in chat box 
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Your target currency is "+tCurrency.toUpperCase().toString(),
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Exchange Rates dated on "+searchDate
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": currencyItems
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));
}