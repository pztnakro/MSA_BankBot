var rest = require('../API/Bankclient');

exports.displaySavedCurrency = function getBaseCurrency(session, username){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.getBaseCurrency(url, session, username, handleBaseCurrencyResponse)
};

exports.setUserCurrency = function setBaseCurrency(session, username, baseCurrency){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.setBaseCurrency(url, session, username, baseCurrency)
};

exports.deleteSavedCurrency = function deleteSavedCurrency(session,username,baseCurrency){
    var url  = 'https://kimbotmsa.azurewebsites.net/tables/BankBot';


    rest.getBaseCurrency(url,session, username,function(message,session,username){
     var   allCurrency = JSON.parse(message);

        for(var i in allCurrency) {

            if (allCurrency[i].baseCurrency === baseCurrency && allCurrency[i].username === username) {

                console.log(allCurrency[i]);

                rest.deleteSavedCurrency(url,session,username,baseCurrency, allCurrency[i].id ,handleDeletedCurrencyResponse)

            }
        }
    });
};

function handleBaseCurrencyResponse(message, session, username) {
    var baseCurrencyResponse = JSON.parse(message);
    var allCurrency = [];
    for (var index in baseCurrencyResponse) {
        var usernameReceived = baseCurrencyResponse[index].username;
        var baseCurrency = baseCurrencyResponse[index].baseCurrency;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all base Currencies unless last one
            if(baseCurrencyResponse.length - 1) {
                allCurrency.push(baseCurrency);
            }
            else {
                allCurrency.push(baseCurrency + ', ');
            }
        }        
    }
    
    // Print all base Currencies for the user that is currently logged in
    session.send("%s, you have set %s as your base currency.", username, allCurrency);                
    
}