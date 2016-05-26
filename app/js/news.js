
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
        
        this.searchInput.addEventListener('keyup', ({target}) => this.search(target));
        this.dateInput.addEventListener('keyup', ({target}) => this.searchDate(target));
        this.backBtn.addEventListener('click', () => this.backToListing());
        
    }
    
    /**
     * 
     */
    bindNewsToHtml( response ){
        
        let data =  JSON.parse( response );
        this.news =  data.results;
        
        this.news.forEach( one => {
            
            let li = document.createElement('li');
            this.news[this.news.indexOf(one)].DOMelement = li ;
            this.news[this.news.indexOf(one)].onAir = true ;
            li.addEventListener('click', ( {target} ) => this.showDetails( one, target ));            
            li.textContent = `${ one.titleNoFormatting } | Published on ${ one.publishedDate }`;
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
        
    }
    
    /**
     * 
     */
    search( target ){
        
        let keyword = target.value;

        this.news.forEach( one => {
            
            let index = one.titleNoFormatting.search( keyword ) ;            
            this.toggleArticle( one.DOMelement, index !== -1 && one.onAir );
           
        });
        
    }
    
    /**
     * 
     */
    searchDate( target ){
        let date = target.value;

        if( date == "") return;
        
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
        
        let index = this.news.indexOf(article);

        if( -1 !== index ) this.news[index].onAir = toggle ;
        
        
        if( false === toggle && undefined !== article.DOMelement ){
             article.DOMelement.classList.add('hide'); 
        }
        else if( true === toggle && undefined !== article.DOMelement ){ 
            article.DOMelement.classList.remove('hide');
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