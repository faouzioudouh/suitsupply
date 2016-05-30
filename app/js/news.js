
'use strict';

/**
 * Class News.
 */
export class News{

    /**
     * Constructor.
     */
    constructor(){
       
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
        this.searchInput.addEventListener('keyup', () => this.displayNews());
        this.dateInput.addEventListener('keyup', () => this.displayNews());
        this.settings.stories_number.addEventListener('keyup', () => this.changeSettings());
        document.addEventListener('keyup', (e) => {
            if (e.keyCode == 27 || e.keyCode == 8) { 
                this.backToListing();
                e.preventDefault();
            }
        });
        
        //change events listeners.
        this.settings.show_related_stories.addEventListener('change', () => this.changeSettings());
        this.settings.show_images.addEventListener('change', () => this.changeSettings());
        
        //Click events listeners.
        this.backBtn.addEventListener('click', () => this.backToListing());
        this.settingBtn.addEventListener('click', () => this.toggleSettingsVisibility());
        this.btnResetSearch.addEventListener('click', () => this.resetSearchForm());
    }
    
    /**
     * Display stories.
     */
    displayNews(){
        
        this.newsListing.innerHTML = "";
        
        if( this.news.length < 1){
            this.toggleNoResulstNotif(true);
            return;
        }         
                
        let keyword = this.searchInput.value.toLowerCase();
        let date = this.dateInput.value;
        this.noResults = true;
        let dateValide = true;
        let keywordValide = true;
        
        let regex = /^(19|20)\d\d[-](0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])$/;
        if( !date.match( regex ) ){ dateValide = false; }
        if( keyword == "" ){ keywordValide = false; }
        
        var query = new RegExp( "(\\b" + keyword + "\\b)", "gi" );
        

        this.news.forEach( story => {
            
            let titleIndex, contentIndex, dateIndex;
            titleIndex = true; contentIndex = true; dateIndex = true;
            
            if( keywordValide ){
                titleIndex = story.titleNoFormatting.toLowerCase().search( keyword ) !== -1 ;            
                contentIndex = story.content.toLowerCase().search( keyword ) !== -1 ;
            }
            if( dateValide ){                
                dateIndex = this._searchDate( story, date );                
            }    
            
            if( (titleIndex || contentIndex) && dateIndex ){

                this.noResults = false;
                let li = document.createElement('li');
                let title = ( keywordValide )? story.titleNoFormatting.replace( query, "<mark>$1</mark>" ) : story.titleNoFormatting;
                li.addEventListener('click', ( {target} ) => this.showDetails( story, target ));            
                li.innerHTML = `${ title } <span class="publishe-date" title="Published date">${ story.publishedDate } </span>`;
                this.newsListing.appendChild(li);                
            }

            
        });
        
        this.toggleNoResulstNotif( this.noResults );
        

    }
    
    /**
     * Set data.
     */
    setData( data ){
        this.news = data;
        this.oldData = data;
    }

    /**
     * Display details of a story.
     */
    showDetails( story , target ){
        
        this.newsListing.classList.add('hide');
        this.searchContainer.classList.add('hide'); 
        this.settingBtn.classList.add('hide'); 
        this.settingsContainer.classList.add('hide'); 
        this.backBtn.classList.remove('hide');         
        
        this.newsDetails.title.innerHTML = `${ story.titleNoFormatting } <span class="publishe-date" title="Published date">${ story.publishedDate } </span>`;
        
        if( this.settings.show_images.checked ){
            
            this.newsDetails.thumbnail.src = story.image.url;
            this.newsDetails.thumbnail.alt = story.titleNoFormatting;
            this.newsDetails.thumbnail.title = story.titleNoFormatting;
            
        }

        this.newsDetails.body.innerHTML = `${ story.content } <a href="${story.unescapedUrl}" target="_blank">Read more.</a>`;
        this.newsDetailsContainer.classList.remove('hide');
        
        //If related stories avialable.
        if( story.relatedStories !== undefined && story.relatedStories.length > 0 ){
            
            this.relatedStoriesTitle.classList.remove('hide');            
            story.relatedStories.forEach( story => {this.showRelatedStories( story )});  
                      
        }else{
            
            this.relatedStoriesTitle.classList.add('hide');
            
        }
        
    }
    
    /**
     * Display related stories.
     */
    showRelatedStories( story ){

            let li = document.createElement('li');
            li.innerHTML  = `<a href="${story.unescapedUrl}" target="_blank">${story.titleNoFormatting}</a> <span class="publisher" title="Publisher">${ story.publisher }</span> <span class="publishe-date" title="Published date">${ story.publishedDate }</span>`;            
            this.newsDetails.relatedStories.appendChild(li);
        
    }
    
    
    /**
     * Show no results message.
     */
    toggleNoResulstNotif( toggle ){
        if( true == toggle) this.noResultsContainer.classList.remove('hide');
        else if( false == toggle) this.noResultsContainer.classList.add('hide');
    }
    
    /**
     * Implementing search by publsihed date function.
     * @private
     */
    _searchDate( story, date  ){
        
            let publishedDate = {};
            let searchDate = {};            
            let split = story.publishedDate.split(' ');
            let new_date = new Date(date);
            
            publishedDate.day = split[1];
            publishedDate.month = split[2];
            publishedDate.year = split[3];
            
            searchDate.day = new_date.getDate().toString();
            searchDate.month = new_date.toLocaleString('en-us', { month: "short" });
            searchDate.year = new_date.getFullYear().toString();
                    
            return searchDate.day === publishedDate.day && searchDate.month === publishedDate.month && searchDate.year === publishedDate.year ;
                   
    }
    
    /**
     * Toggle article visibility (hide/show).
     */
    toggleArticle( article , toggle, keyword ){
                
        let index = this.news.indexOf(article);
        
        if( false === toggle && undefined !== article.DOMelement ){
             article.DOMelement.classList.add('hide'); 
        }
        else if( true === toggle && undefined !== article.DOMelement ){ 
            this.noResults = false;
            article.DOMelement.classList.remove( 'hide' );
            
            if( keyword !== "" ){
                var query = new RegExp( "(\\b" + keyword + "\\b)", "gim" );
                article.DOMelement.innerHTML = `${ this.news[index].titleNoFormatting.replace( query, "<mark>$1</mark>" ) } <span class="publishe-date">${ article.publishedDate } </span>`;
            }
            
        }
    }
    
    /**
     * Click event listener callback.
     */
    backToListing(){

        this.newsListing.classList.remove('hide');
        this.backBtn.classList.add('hide'); 
        this.newsDetailsContainer.classList.add('hide');
        this.searchContainer.classList.remove('hide');         
        this.settingBtn.classList.remove('hide');         
        
    }
    
    /**
     * Toggle settings visibility.
     */
    toggleSettingsVisibility(){
        
        if( this.settingsContainer.classList.contains('hide') ){
            this.settingsContainer.classList.remove('hide');            
            this.searchContainer.classList.add('hide');            
        }else{
            this.searchContainer.classList.remove('hide');                        
            this.settingsContainer.classList.add('hide');                        
        }
    }
    
    /**
     * 
     */
    changeSettings(){
        
        if( this.settings.show_related_stories.checked ){
            this.newsDetails.relatedStories.classList.remove('hide');
        }else{
            this.newsDetails.relatedStories.classList.add('hide');            
        }
        
        if( this.settings.show_images.checked ){
            this.newsDetails.thumbnail.classList.remove('hide');            
        }else{
            this.newsDetails.thumbnail.classList.add('hide');                        
        }
        
        if( this.settings.stories_number.value > 0){
            this.news = this.oldData;
            this.news = this.news.slice(0,this.settings.stories_number.value);
            this.displayNews()
        }else{
            this.news = this.oldData;            
            this.displayNews();            
        }
    }
    
    /**
     * Reset search form.
     */
    resetSearchForm(){
        document.getElementById("search-form").reset();
        this.displayNews(this.news);
        
    }
    
     /**
     * Called in case slow connection.
     * in this case we'll prevent loading stroies images.
     */
    slowConnection(){
        this.slowConnectionMessage.classList.remove('hide');
        this.settings.show_images.checked = false;
        window.setTimeout(()=>{
            this.slowConnectionMessage.classList.add('hide');
        }, 4000)
    }
    
    
    /**
     * Get news JSON.
     */
    httpGet(url) {
        
        var _this = this;
        return new Promise(function (resolve, reject) {
            
        var request = new XMLHttpRequest();
        
        request.open('GET', url);
        request.onload = function () {
            
            if (request.status == 200) {

                _this.request.endTime = (new Date()).getTime();
                _this.request.fileSize = request.responseText.length;
                let speed = (_this.request.fileSize * 8) / ((_this.request.endTime - _this.request.startTime)/1000) / 1024;

                //Slow connection
                if(speed < 2000){
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
   
   
    
}