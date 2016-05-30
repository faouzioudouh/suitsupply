'use strict';

import {News} from "./news";

const news = new News();

//This is used to calculate connection speed.
news.request.startTime = (new Date()).getTime();

//Get stores.
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
