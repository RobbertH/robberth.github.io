// ==UserScript==
// @name         Collect & Go
// @version      0.1
// @description  Script to fetch ingredients from Colruyt mealboxes and add them to cart on Collect and Go
// @author       You
// @match        https://colruyt.collectandgo.be/*
// @grant        https://colruyt.collectandgo.be/*
// ==/UserScript==

'use strict';

let URL_MODIFIER = "tntntn"; // this can be anything that colruyt doesn't recognize as a parameter

let extract_ingredients = function() {
    console.log("Extracting ingredients");

    let recipe__ingredients = document.getElementsByClassName("recipe__ingredients");
    let ingredients = recipe__ingredients[0].children[1].children;
    console.log(ingredients.length);
    console.log("Opening new tab per ingredient");

    let urlString;
    for (let i=0; i<ingredients.length; i++){
        urlString = 'https://colruyt.collectandgo.be/cogo/nl/zoeken?z=';
        urlString += ingredients[i].innerText;
        urlString += '&category=generic';
        urlString += "&" + URL_MODIFIER + "=true"; // modify URL so that other script can take over

        window.open(urlString, '_blank'); // _blank means open in new tab
    }

    console.log("Ingredient extraction done");

}

let buy_ingredient = function() {
    console.log("Buying ingredient");

  	let articles = document.querySelector("#articles").firstChild.firstChild; // buy first item once
  	console.log("Got articles:");
  	console.log(articles);
    articles.lastChild.lastChild.firstChild.firstChild.submit()
    window.close();

    console.log("Done buying ingredient");
}

let main = function() {
  console.log("Running greasemonkey script!");

  let url = window.location.href;
  if (url.indexOf("recipedetail") > -1) { // URL contains "recipedetail"
    extract_ingredients();
  }
  if (url.indexOf(URL_MODIFIER) > -1) { // URL was modified by this script
  	buy_ingredient();
  }

  console.log("Done running greasemonkey script!");
}

main();
