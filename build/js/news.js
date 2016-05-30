
'use strict';

/**
 * Class News.
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var News = exports.News = function () {

    /**
     * Constructor.
     */

    function News() {
        var _this2 = this;

        _classCallCheck(this, News);

        this.news = [];
        this.request = {};
        //search elements.
        this.searchInput = document.getElementById('search');
        this.searchContainer = document.getElementById('search-container');
        this.dateInput = document.getElementById('date');

        //settings elemenst.
        this.settingBtn = document.getElementById('setting-btn');
        this.settingsContainer = document.getElementById('settings-container');
        this.settings = {};
        this.settings.stories_number = document.getElementById('stories-number');
        this.settings.show_related_stories = document.getElementById('show-related-stories');
        this.settings.show_images = document.getElementById('show-images');
        this.btnResetSearch = document.getElementById('reset-search');

        this.backBtn = document.getElementById('back-btn');
        this.newsContainer = document.getElementById('container');
        this.newsListing = document.getElementById('news-listing');
        this.noResultsContainer = document.getElementById('no-results');
        this.slowConnectionMessage = document.getElementById('slow-connection-message');

        this.newsDetailsContainer = document.getElementById('news-details');
        this.newsDetails = {};
        this.newsDetails.title = document.getElementById('details-title');
        this.newsDetails.thumbnail = document.getElementById('thumbnail');
        this.newsDetails.body = document.getElementById('details-body');
        this.newsDetails.relatedStories = document.getElementById('listing-related-stories');

        this.relatedStoriesTitle = document.getElementById('related-stories-label');

        //keyup events listeners.       
        this.searchInput.addEventListener('keyup', function () {
            return _this2.displayNews();
        });
        this.dateInput.addEventListener('keyup', function () {
            return _this2.displayNews();
        });
        this.settings.stories_number.addEventListener('keyup', function () {
            return _this2.changeSettings();
        });
        document.addEventListener('keyup', function (e) {
            if (e.keyCode == 27 || e.keyCode == 8) {
                _this2.backToListing();
                e.preventDefault();
            }
        });

        //change events listeners.
        this.settings.show_related_stories.addEventListener('change', function () {
            return _this2.changeSettings();
        });
        this.settings.show_images.addEventListener('change', function () {
            return _this2.changeSettings();
        });

        //Click events listeners.
        this.backBtn.addEventListener('click', function () {
            return _this2.backToListing();
        });
        this.settingBtn.addEventListener('click', function () {
            return _this2.toggleSettingsVisibility();
        });
        this.btnResetSearch.addEventListener('click', function () {
            return _this2.resetSearchForm();
        });
    }

    /**
     * Display stories.
     */


    _createClass(News, [{
        key: 'displayNews',
        value: function displayNews() {
            var _this3 = this;

            this.newsListing.innerHTML = "";

            if (this.news.length < 1) {
                this.toggleNoResulstNotif(true);
                return;
            }

            var keyword = this.searchInput.value.toLowerCase();
            var date = this.dateInput.value;
            this.noResults = true;
            var dateValide = true;
            var keywordValide = true;

            var regex = /^(19|20)\d\d[-](0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])$/;
            if (!date.match(regex)) {
                dateValide = false;
            }
            if (keyword == "") {
                keywordValide = false;
            }

            var query = new RegExp("(\\b" + keyword + "\\b)", "gi");

            this.news.forEach(function (story) {

                var titleIndex = void 0,
                    contentIndex = void 0,
                    dateIndex = void 0;
                titleIndex = true;contentIndex = true;dateIndex = true;

                if (keywordValide) {
                    titleIndex = story.titleNoFormatting.toLowerCase().search(keyword) !== -1;
                    contentIndex = story.content.toLowerCase().search(keyword) !== -1;
                }
                if (dateValide) {
                    dateIndex = _this3._searchDate(story, date);
                }

                if ((titleIndex || contentIndex) && dateIndex) {

                    _this3.noResults = false;
                    var li = document.createElement('li');
                    var title = keywordValide ? story.titleNoFormatting.replace(query, "<mark>$1</mark>") : story.titleNoFormatting;
                    li.addEventListener('click', function (_ref) {
                        var target = _ref.target;
                        return _this3.showDetails(story, target);
                    });
                    li.innerHTML = title + ' <span class="publishe-date" title="Published date">' + story.publishedDate + ' </span>';
                    _this3.newsListing.appendChild(li);
                }
            });

            this.toggleNoResulstNotif(this.noResults);
        }

        /**
         * Set data.
         */

    }, {
        key: 'setData',
        value: function setData(data) {
            this.news = data;
            this.oldData = data;
        }

        /**
         * Display details of a story.
         */

    }, {
        key: 'showDetails',
        value: function showDetails(story, target) {
            var _this4 = this;

            this.newsListing.classList.add('hide');
            this.searchContainer.classList.add('hide');
            this.settingBtn.classList.add('hide');
            this.settingsContainer.classList.add('hide');
            this.backBtn.classList.remove('hide');

            this.newsDetails.title.innerHTML = story.titleNoFormatting + ' <span class="publishe-date" title="Published date">' + story.publishedDate + ' </span>';

            if (this.settings.show_images.checked) {

                this.newsDetails.thumbnail.src = story.image.url;
                this.newsDetails.thumbnail.alt = story.titleNoFormatting;
                this.newsDetails.thumbnail.title = story.titleNoFormatting;
            }

            this.newsDetails.body.innerHTML = story.content + ' <a href="' + story.unescapedUrl + '" target="_blank">Read more.</a>';
            this.newsDetailsContainer.classList.remove('hide');

            //If related stories avialable.
            if (story.relatedStories !== undefined && story.relatedStories.length > 0) {

                this.relatedStoriesTitle.classList.remove('hide');
                story.relatedStories.forEach(function (story) {
                    _this4.showRelatedStories(story);
                });
            } else {

                this.relatedStoriesTitle.classList.add('hide');
            }
        }

        /**
         * Display related stories.
         */

    }, {
        key: 'showRelatedStories',
        value: function showRelatedStories(story) {

            var li = document.createElement('li');
            li.innerHTML = '<a href="' + story.unescapedUrl + '" target="_blank">' + story.titleNoFormatting + '</a> <span class="publisher" title="Publisher">' + story.publisher + '</span> <span class="publishe-date" title="Published date">' + story.publishedDate + '</span>';
            this.newsDetails.relatedStories.appendChild(li);
        }

        /**
         * Show no results message.
         */

    }, {
        key: 'toggleNoResulstNotif',
        value: function toggleNoResulstNotif(toggle) {
            if (true == toggle) this.noResultsContainer.classList.remove('hide');else if (false == toggle) this.noResultsContainer.classList.add('hide');
        }

        /**
         * Implementing search by publsihed date function.
         * @private
         */

    }, {
        key: '_searchDate',
        value: function _searchDate(story, date) {

            var publishedDate = {};
            var searchDate = {};
            var split = story.publishedDate.split(' ');
            var new_date = new Date(date);

            publishedDate.day = split[1];
            publishedDate.month = split[2];
            publishedDate.year = split[3];

            searchDate.day = new_date.getDate().toString();
            searchDate.month = new_date.toLocaleString('en-us', { month: "short" });
            searchDate.year = new_date.getFullYear().toString();

            return searchDate.day === publishedDate.day && searchDate.month === publishedDate.month && searchDate.year === publishedDate.year;
        }

        /**
         * Toggle article visibility (hide/show).
         */

    }, {
        key: 'toggleArticle',
        value: function toggleArticle(article, toggle, keyword) {

            var index = this.news.indexOf(article);

            if (false === toggle && undefined !== article.DOMelement) {
                article.DOMelement.classList.add('hide');
            } else if (true === toggle && undefined !== article.DOMelement) {
                this.noResults = false;
                article.DOMelement.classList.remove('hide');

                if (keyword !== "") {
                    var query = new RegExp("(\\b" + keyword + "\\b)", "gim");
                    article.DOMelement.innerHTML = this.news[index].titleNoFormatting.replace(query, "<mark>$1</mark>") + ' <span class="publishe-date">' + article.publishedDate + ' </span>';
                }
            }
        }

        /**
         * Click event listener callback.
         */

    }, {
        key: 'backToListing',
        value: function backToListing() {

            this.newsListing.classList.remove('hide');
            this.backBtn.classList.add('hide');
            this.newsDetailsContainer.classList.add('hide');
            this.searchContainer.classList.remove('hide');
            this.settingBtn.classList.remove('hide');
        }

        /**
         * Toggle settings visibility.
         */

    }, {
        key: 'toggleSettingsVisibility',
        value: function toggleSettingsVisibility() {

            if (this.settingsContainer.classList.contains('hide')) {
                this.settingsContainer.classList.remove('hide');
                this.searchContainer.classList.add('hide');
            } else {
                this.searchContainer.classList.remove('hide');
                this.settingsContainer.classList.add('hide');
            }
        }

        /**
         * 
         */

    }, {
        key: 'changeSettings',
        value: function changeSettings() {

            if (this.settings.show_related_stories.checked) {
                this.newsDetails.relatedStories.classList.remove('hide');
            } else {
                this.newsDetails.relatedStories.classList.add('hide');
            }

            if (this.settings.show_images.checked) {
                this.newsDetails.thumbnail.classList.remove('hide');
            } else {
                this.newsDetails.thumbnail.classList.add('hide');
            }

            if (this.settings.stories_number.value > 0) {
                this.news = this.oldData;
                this.news = this.news.slice(0, this.settings.stories_number.value);
                this.displayNews();
            } else {
                this.news = this.oldData;
                this.displayNews();
            }
        }

        /**
         * Reset search form.
         */

    }, {
        key: 'resetSearchForm',
        value: function resetSearchForm() {
            document.getElementById("search-form").reset();
            this.displayNews(this.news);
        }

        /**
        * Called in case slow connection.
        * in this case we'll prevent loading stroies images.
        */

    }, {
        key: 'slowConnection',
        value: function slowConnection() {
            var _this5 = this;

            this.slowConnectionMessage.classList.remove('hide');
            this.settings.show_images.checked = false;
            window.setTimeout(function () {
                _this5.slowConnectionMessage.classList.add('hide');
            }, 4000);
        }

        /**
         * Get news JSON.
         */

    }, {
        key: 'httpGet',
        value: function httpGet(url) {

            var _this = this;
            return new Promise(function (resolve, reject) {

                var request = new XMLHttpRequest();

                request.open('GET', url);
                request.onload = function () {

                    if (request.status == 200) {

                        _this.request.endTime = new Date().getTime();
                        _this.request.fileSize = request.responseText.length;
                        var speed = _this.request.fileSize * 8 / ((_this.request.endTime - _this.request.startTime) / 1000) / 1024;

                        //Slow connection
                        if (speed < 2000) {
                            _this.slowConnection();
                        };

                        resolve(request.response);
                    } else {
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function () {
                    reject(Error('Sorry, something went wrong'));
                };

                request.send();
            });
        }
    }]);

    return News;
}();