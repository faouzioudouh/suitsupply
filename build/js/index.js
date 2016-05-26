'use strict';

var _news = require('./news');

var news = new _news.News();

news.httpGet('resources/data/data.json').then(function (response) {
    news.bindNewsToHtml(response);
}, function (error) {
    console.log(error);
});