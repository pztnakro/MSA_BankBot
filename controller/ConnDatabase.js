var rest = require('../API/Bankclient');

exports.displaySavedCurrency = function getFavouriteCurrency(session, username){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.getFavouriteCurrency(url, session, username, handleFavouriteCurrencyResponse)
};

exports.setUserCurrency = function postExchangeRate(session, username, favouriteCurrency){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.postExchangeRate(url, session, username, favouriteCurrency)
};

exports.deleteSavedCurrency = function deleteSavedCurrency(session,username,favouriteCurrency){
    var url  = 'https://kimbotmsa.azurewebsites.net/tables/BankBot';


    rest.getFavouriteCurrency(url,session, username,function(message,session,username){
     var   allCurrency = JSON.parse(message);

        for(var i in allCurrency) {

            if (allCurrency[i].favouriteCurrency === favouriteCurrency && allCurrency[i].username === username) {

                console.log(allCurrency[i]);

                rest.deleteSavedCurrency(url,session,username,favouriteCurrency, allCurrency[i].id ,handleDeletedCurrencyResponse)

            }
        }
    });
};

function handleFavouriteCurrencyResponse(message, session, username) {
    var favouriteCurrencyResponse = JSON.parse(message);
    var allCurrency = [];
    for (var index in favouriteCurrencyResponse) {
        var usernameReceived = favouriteCurrencyResponse[index].username;
        var favouriteCurrency = favouriteCurrencyResponse[index].favouriteCurrency;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite Currencies unless last one
            if(favouriteCurrencyResponse.length - 1) {
                allCurrency.push(favouriteCurrency);
            }
            else {
                allCurrency.push(favouriteCurrency + ', ');
            }
        }        
    }
    
    // Print all favourite Currencies for the user that is currently logged in
    session.send("%s, your saved currencies are: %s", username, allCurrency);                
    
}