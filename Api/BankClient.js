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

// get base currency from database
exports.getBaseCurrency = function getData(url, session, username, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.setBaseCurrency = function getData(url, username, baseCurrency){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "baseCurrency" : baseCurrency
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

exports.updateSavedCurrency = function updateData(url,session, username ,baseCurrency, id){
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
            //callback(body,session,username, baseCurrency);
        }else {
            console.log(err);
            console.log(res);
        }
    })

    // update to a new base currency
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "baseCurrency" : baseCurrency
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

exports.deleteSavedCurrency = function deleteData(url,session, username ,baseCurrency, id){
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
            //callback(body,session,username, baseCurrency);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};

exports.custInquiry = function getData(url, session, question, callback){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': '7ff907b8ac294a98bf1f8a4cd0612762',
            'Content-Type':'application/json'
        },
        json: {
            "question" : question
        }
      };
  
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body, session, question);
        }
        else{
            console.log(error);
        }
      });
  };

