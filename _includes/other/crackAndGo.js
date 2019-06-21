// ==UserScript==
// @name         Crack & Go
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://colruyt.collectandgo.be/*
// @grant        https://colruyt.collectandgo.be/*
// ==/UserScript==

var URL_MODIFIER = "tntntn"; // this can be anything that colruyt doesn't recognize as a parameter

var extract_ingredients = function() {
    'use strict'; // never use unitialized variables,...

    console.log("CRACK & GO - Extracting ingredients -----------------------------------------");

    var recipe__ingredients = document.getElementsByClassName("recipe__ingredients");
    console.log(recipe__ingredients);
    var ingredients = recipe__ingredients[0].children[1].children;
    console.log(ingredients);
    console.log(ingredients.length);
    var i;
    for (i=0; i<ingredients.length; i++){
        console.log(ingredients[i].innerText);
    }

    console.log("CRACK & GO - Opening new tab per ingredient ------------------------------------------");

    var urlString;
    for (i=0; i<ingredients.length; i++){
        urlString = 'https://colruyt.collectandgo.be/cogo/nl/zoeken?z=';
        urlString += ingredients[i].innerText;
        urlString += '&category=generic';
        urlString += "&" + URL_MODIFIER + "=true"; // modify URL so that other script can take over

        window.open(urlString, '_blank'); // _blank means open in new tab
    }

    console.log("CRACK & GO - Ingredient extraction done, continue on other tabs ------------------------------------------");

}

var buy_ingredient = function() {
    'use strict';

    console.log("CRACK & GO - Buying ingredient --------------------------");


  	var articles = document.querySelector("#articles").firstChild.firstChild; // buy first item once
  	console.log("CRACK & GO - Got articles: ---------- ");
  	console.log(articles);
    articles.lastChild.lastChild.firstChild.firstChild.submit()
    window.close();

    console.log("CRACK & GO - Done buying ingredient --------------------------");
}

var main = function() {
  console.log("Running greasemonkey script!");

  var url = window.location.href;
  if (url.indexOf("recipedetail") > -1) { // URL contains "recipedetail"
    extract_ingredients();
  }
  if (url.indexOf(URL_MODIFIER) > -1) { // URL was modified by Crack & Go script
  	buy_ingredient();
  }

  console.log("Done running greasemonkey script!");
}

main();
