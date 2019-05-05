// ==UserScript==
// @name         Crack & Go
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://colruyt.collectandgo.be/cogo/nl/recipedetail/105868/06-05-2019/1
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("CRACK & GO ------------------------------------------");

    var recipe__ingredients = document.getElementsByClassName("recipe__ingredients");
    console.log(recipe__ingredients);
    var ingredients = recipe__ingredients[0].children[1].children;
    console.log(ingredients);
    console.log(ingredients.length);
    var i;
    for (i=0; i<ingredients.length; i++){
        console.log(ingredients[i].innerText);
    }

    console.log("CRACK & GO ------------------------------------------");

    var urlString;
    for (i=0; i<ingredients.length; i++){
        urlString = 'https://colruyt.collectandgo.be/cogo/nl/zoeken?z=';
        urlString += ingredients[i].innerText;
        urlString += '&category=generic';
        urlString += "&bobbie=true"; // modify URL so that other script can take over

        window.open(urlString, '_blank'); // _blank means open in new tab
    }

    console.log("CRACK & GO GO ------------------------------------------");


})();
