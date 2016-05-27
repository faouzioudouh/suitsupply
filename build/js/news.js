
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var News = exports.News = function () {
    function News(content) {
        var _this = this;

        _classCallCheck(this, News);

        this.news = [];

        this.searchInput = document.getElementById('search');
        this.dateInput = document.getElementById('date');

        this.backBtn = document.getElementById('back-btn');
        this.newsContainer = document.getElementById('container');
        this.newsListing = document.getElementById('news-listing');

        this.newsDetailsContainer = document.getElementById('news-details');
        this.newsDetails = {};
        this.newsDetails.title = document.getElementById('details-title');
        this.newsDetails.thumbnail = document.getElementById('thumbnail');
        this.newsDetails.body = document.getElementById('details-body');
        this.newsDetails.relatedStories = document.getElementById('listing-related-stories');

        this.searchInput.addEventListener('keyup', function (_ref) {
            var target = _ref.target;
            return _this.search(target);
        });
        this.dateInput.addEventListener('change', function (_ref2) {
            var target = _ref2.target;
            return _this.searchDate(target);
        });
        this.backBtn.addEventListener('click', function () {
            return _this.backToListing();
        });
    }

    /**
     * 
     */


    _createClass(News, [{
        key: 'displayNews',
        value: function displayNews(response) {
            var _this2 = this;

            var data = JSON.parse(response);
            this.news = data.results;

            this.news.forEach(function (one) {

                var li = document.createElement('li');
                var index = _this2.news.indexOf(one);
                _this2.news[index].DOMelement = li;

                li.addEventListener('click', function (_ref3) {
                    var target = _ref3.target;
                    return _this2.showDetails(one, target);
                });
                li.innerHTML = one.titleNoFormatting + ' | Published on ' + one.publishedDate;
                li.classList.add("test");
                _this2.newsListing.appendChild(li);
            });
        }

        /**
         * 
         */

    }, {
        key: 'showDetails',
        value: function showDetails(article, target) {
            var _this3 = this;

            this.newsListing.classList.add('hide');
            this.backBtn.classList.remove('hide');

            this.newsDetails.title.textContent = article.titleNoFormatting + ' | Published on ' + article.publishedDate;
            this.newsDetails.thumbnail.src = article.image.url;
            this.newsDetails.body.textContent = '' + article.titleNoFormatting;
            this.newsDetailsContainer.classList.remove('hide');

            article.relatedStories.forEach(function (story) {
                _this3.showRelatedStories(story);
            });
        }
    }, {
        key: 'showRelatedStories',
        value: function showRelatedStories(story) {

            var li = document.createElement('li');
            li.innerHTML = story.publisher + ' : <a href="' + story.url + '">' + story.titleNoFormatting + '</a> - Published on ' + story.publishedDate;
            this.newsDetails.relatedStories.appendChild(li);
        }

        /**
         * 
         */

    }, {
        key: 'search',
        value: function search(target) {
            var _this4 = this;

            var keyword = target.value.toLowerCase();

            this.news.forEach(function (one) {

                var titleIndex = one.titleNoFormatting.toLowerCase().search(keyword);
                var contentIndex = one.content.toLowerCase().search(keyword);
                var hasClassHide = one.DOMelement.classList.contain('hide');
                console.log("has class " + hasClassHide);
                _this4.toggleArticle(one, contentIndex !== -1 || titleIndex !== -1 && !hasClassHide, keyword);
            });
            console.log(this.news);
        }

        /**
         * 
         */

    }, {
        key: 'searchDate',
        value: function searchDate(target) {
            var _this5 = this;

            var date = target.value;
            var displayAll = false;
            var regex = /^(19|20)\d\d[-](0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])$/;
            if (date == "" || !date.match(regex)) {
                displayAll = true;
            }

            this.news.forEach(function (one) {

                var publishedDate = {};
                var searchDate = {};
                var split = one.publishedDate.split(' ');
                var new_date = new Date(date);

                publishedDate.day = split[1];
                publishedDate.month = split[2];
                publishedDate.year = split[3];

                searchDate.day = new_date.getDate().toString();
                searchDate.month = new_date.toLocaleString('en-us', { month: "short" });
                searchDate.year = new_date.getFullYear().toString();

                var hasClassHide = one.DOMelement.classList.value !== "" ? one.DOMelement.classList.value.indexOf('hide') > -1 : false;

                _this5.toggleArticle(one, !hasClassHide && (displayAll || searchDate.day === publishedDate.day && searchDate.month === publishedDate.month && searchDate.year === publishedDate.year));
            });
        }

        /**
         * 
         */

    }, {
        key: 'toggleArticle',
        value: function toggleArticle(article, toggle, keyword) {

            var index = this.news.indexOf(article);

            if (false === toggle && undefined !== article.DOMelement) {
                article.DOMelement.classList.add('hide');
            } else if (true === toggle && undefined !== article.DOMelement) {

                article.DOMelement.classList.remove('hide');

                var query = new RegExp("(\\b" + keyword + "\\b)", "gi");
                article.DOMelement.innerHTML = this.news[index].titleNoFormatting.replace(query, "<mark>$1</mark>");
            }
        }

        /**
         * 
         */

    }, {
        key: 'backToListing',
        value: function backToListing() {

            this.newsListing.classList.remove('hide');
            this.backBtn.classList.add('hide');
            this.newsDetailsContainer.classList.add('hide');
        }

        /**
         * 
         */

    }, {
        key: 'httpGet',
        value: function httpGet(url) {

            return new Promise(function (resolve, reject) {

                var request = new XMLHttpRequest();

                request.open('GET', url);
                request.onload = function () {

                    if (request.status == 200) {
                        resolve(request.response);
                    } else {
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function () {
                    reject(Error('Something went wrong'));
                };

                request.send();
            });
        }
    }]);

    return News;
}();