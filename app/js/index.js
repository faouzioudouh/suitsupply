'use strict';

import {News} from "./news";

const news = new News();


news.httpGet('resources/data/data.json')
    .then( 
        response =>  {
            let data =  JSON.parse( response );
            news.setData( data.results );
            news.displayNews();
        }, 
        error => {
            console.log(error);
        }
    );
