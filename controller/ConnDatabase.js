var rest = require('../API/Bankclient');
var luis = require('./LuisDialog');

exports.displaySavedCurrency = function getBaseCurrency(session, username){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.getBaseCurrency(url, session, username, handleBaseCurrencyResponse)
};

exports.setUserCurrency = function setBaseCurrency(session, username, baseCurrency){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.setBaseCurrency(url, username, baseCurrency)
};

exports.updateSavedCurrency = function updateSavedCurrency(session,username,baseCurrency){
    var url  = 'https://kimbotmsa.azurewebsites.net/tables/BankBot';

    rest.getBaseCurrency(url,session, username,function(message,session,username){
     var   allCurrency = JSON.parse(message);

        for(var i in allCurrency) {

            //if (allCurrency[i].baseCurrency === baseCurrency && allCurrency[i].username === username) {
            if (allCurrency[i].username === username) {
                rest.updateSavedCurrency(url,session,username,baseCurrency, allCurrency[i].id)
            }
        }
        
    });
};

exports.deleteSavedCurrency = function deleteSavedCurrency(session,username,baseCurrency){
    var url  = 'https://kimbotmsa.azurewebsites.net/tables/BankBot';

    rest.getBaseCurrency(url,session, username,function(message,session,username){
     var   allCurrency = JSON.parse(message);

        for(var i in allCurrency) {

            //if (allCurrency[i].baseCurrency === baseCurrency && allCurrency[i].username === username) {
            if (allCurrency[i].username === username) {
                rest.deleteSavedCurrency(url,session,username,baseCurrency, allCurrency[i].id)
            }
        }
    });
};

function handleBaseCurrencyResponse(message, session, username) {
    var baseCurrencyResponse = JSON.parse(message);
    var setBaseCurrency;
    
    for (var index in baseCurrencyResponse) {
        var usernameReceived = baseCurrencyResponse[index].username;
        var baseCurrency = baseCurrencyResponse[index].baseCurrency;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            setBaseCurrency = baseCurrency;
        }
    }
    if(!setBaseCurrency){
        session.send("%s, No base currency is set on your account.", username);
        session.send("Please set your base currency or type 'Help'.");
    }else{
        // Print all base Currencies for the user that is currently logged in
        session.conversationData["currency"] = setBaseCurrency;
        session.send("%s, you have set %s as your base currency.", username, setBaseCurrency.toUpperCase());
    }
}
