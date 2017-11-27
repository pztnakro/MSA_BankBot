var request = require('request');

// get exchange rate from fixer(http://fixer.io/) api
exports.getExchangeRate = function getData(url, session, baseCurrency, targetCurrency, callback){
    
        request.get(url, function processGetRequest(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body, baseCurrency, targetCurrency, session);
            }
        });
    };


exports.sendFavouriteFood = function postFavouriteFood(session, username, favouriteFood){
    var url = 'https://kimbotmsa.azurewebsites.net/tables/BankBot';
    rest.postFavouriteFood(url, username, favouriteFood);
};

exports.postFavouriteFood = function getData(url, username, favouriteFood){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "favouriteFood" : favouriteFood
        }
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};


exports.deleteSavedCurrency = function deleteData(url,session, username ,favouriteFood, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username, favouriteFood);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};

