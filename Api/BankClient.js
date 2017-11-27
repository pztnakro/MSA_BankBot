var request = require('request');

// get exchange rate from fixer(http://fixer.io/) api
exports.getExchangeRate = function getData(url,session, callback){
    
    //request.get(url,{'auth': { 'bearer': bearer}} ,function(err,res,body){
    request.get(url ,function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body,session);
        }
    });
};

