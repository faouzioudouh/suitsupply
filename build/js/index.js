'use strict';

var _news = require('./news');

var news = new _news.News();

//This is used to calculate connection speed.
news.request.startTime = new Date().getTime();

//Get stores.
news.httpGet('resources/data/data.json').then(function (response) {
    var data = JSON.parse(response);
    news.setData(data.results);
    news.displayNews();
}, function (error) {
    console.log(error);
});