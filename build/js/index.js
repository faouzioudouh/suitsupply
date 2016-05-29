'use strict';

var _news = require('./news');

var news = new _news.News();

news.httpGet('resources/data/data.json').then(function (response) {
    var data = JSON.parse(response);
    news.setData(data.results);
    news.displayNews();
}, function (error) {
    console.log(error);
});