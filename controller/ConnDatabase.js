var rest = require('../API/Bankclient');

exports.displaySavedCurrency = function getExchangeRate(session, username){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.getExchangeRate(url, session, username, handleFavouriteFoodResponse)
};

exports.setUserCurrency = function getExchangeRate(session, username, favouriteFood){
    var url = 'http://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.getExchangeRate(url, session, username, favouriteFood)
};

exports.deleteSavedCurrency = function deleteSavedCurrency(session,username,favouriteFood){
    var url  = 'https://kimbotmsa.azurewebsites.net/tables/BankBot';


    rest.getExchangeRate(url,session, username,function(message,session,username){
     var   allCurrency = JSON.parse(message);

        for(var i in allCurrency) {

            if (allCurrency[i].favouriteFood === favouriteFood && allCurrency[i].username === username) {

                console.log(allCurrency[i]);

                rest.deleteSavedCurrency(url,session,username,favouriteFood, allCurrency[i].id ,handleDeletedFoodResponse)

            }
        }
    });
};

function handleFavouriteFoodResponse(message, session, username) {
    var favouriteFoodResponse = JSON.parse(message);
    var allCurrency = [];
    for (var index in favouriteFoodResponse) {
        var usernameReceived = favouriteFoodResponse[index].username;
        var favouriteFood = favouriteFoodResponse[index].favouriteFood;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(favouriteFoodResponse.length - 1) {
                allCurrency.push(favouriteFood);
            }
            else {
                allCurrency.push(favouriteFood + ', ');
            }
        }        
    }
    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your saved currencies are: %s", username, allCurrency);                
    
}