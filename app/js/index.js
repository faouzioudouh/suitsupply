'use strict';

import {News} from "./news";

const news = new News();


news.httpGet('resources/data/data.json')
    .then( 
        response =>  {
            news.bindNewsToHtml( response );
        }, 
        error => {
            console.log(error);
        }
    );
