
'use strict';

export class News{

    constructor( content ){
       
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
        
        this.searchInput.addEventListener('keyup', ({target}) => this.search(target));
        this.dateInput.addEventListener('change', ({target}) => this.searchDate(target));
        this.backBtn.addEventListener('click', () => this.backToListing());
        
    }
    
    /**
     * 
     */
    bindNewsToHtml( response ){
        
        let data =  JSON.parse( response );
        this.news =  data.results;
        
        this.news.forEach( one => {
            console.log( one );
            let li = document.createElement('li');
            this.news[this.news.indexOf(one)].DOMelement = li ;
            this.news[this.news.indexOf(one)].onAir = true ;
            li.addEventListener('click', ( {target} ) => this.showDetails( one, target ));            
            li.innerHTML = `${ one.titleNoFormatting } | Published on ${ one.publishedDate }`;
            this.newsListing.appendChild(li);
            
        });

    }

    /**
     * 
     */
    showDetails( article , target ){
        
        this.newsListing.classList.add('hide');
        this.backBtn.classList.remove('hide'); 
        
        this.newsDetails.title.textContent = `${ article.titleNoFormatting } | Published on ${ article.publishedDate }`;
        this.newsDetails.thumbnail.src = article.image.url;
        this.newsDetails.body.textContent = `${ article.titleNoFormatting }`;
        this.newsDetailsContainer.classList.remove('hide');
        
        article.relatedStories.forEach( story => {this.showRelatedStories( story )});
        
    }
    
    showRelatedStories( story ){
                
            let li = document.createElement('li');
            li.innerHTML  = `${ story.publisher } : <a href="${story.url}">${story.titleNoFormatting}</a> - Published on ${ story.publishedDate }`;            
            this.newsDetails.relatedStories.appendChild(li);
        
    }
    
    /**
     * 
     */
    search( target ){
        
        let keyword = target.value;

        this.news.forEach( one => {
            console.log( one.onAir );
            let titleIndex = one.titleNoFormatting.toLowerCase().search( keyword ) ;            
            let contentIndex = one.content.toLowerCase().search( keyword ) ;            
            this.toggleArticle( one , contentIndex !== -1 || titleIndex !== -1 );
           
        });
        
    }
    
    /**
     * 
     */
    searchDate( target ){
        
        let date = target.value;
        let regex = /^(19|20)\d\d[-](0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])$/;
        if( date == "" || !date.match( regex ) ) return;
        
        this.news.forEach( one => {
            
            let publishedDate = {};
            let searchDate = {};            
            let split = one.publishedDate.split(' ');
            let new_date = new Date(date);
            
            publishedDate.day = split[1];
            publishedDate.month = split[2];
            publishedDate.year = split[3];
            
            searchDate.day = new_date.getDate().toString();
            searchDate.month = new_date.toLocaleString('en-us', { month: "short" });
            searchDate.year = new_date.getFullYear().toString();

            this.toggleArticle(one, 
                searchDate.day === publishedDate.day &&
                searchDate.month === publishedDate.month && 
                searchDate.year === publishedDate.year
            );
           
        });
        
    }
    
    /**
     * 
     */
    toggleArticle( article , toggle ){
        console.log( this.news);
        let index = this.news.indexOf(article);

        // if( -1 !== index ) this.news[index].onAir = toggle ;
        
        
        if( false === toggle && undefined !== article.DOMelement ){
             article.DOMelement.classList.add('hide'); 
             this.news[index].onAir = true;
        }
        else if( true === toggle && undefined !== article.DOMelement ){ 
            article.DOMelement.classList.remove('hide');
             this.news[index].onAir = false;
            
        }
    }
    
    /**
     * 
     */
    backToListing(){

        this.newsListing.classList.remove('hide');
        this.backBtn.classList.add('hide'); 
        this.newsDetailsContainer.classList.add('hide');
        
    }
    
    /**
     * 
     */
    httpGet(url) {
        
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
   
    
}