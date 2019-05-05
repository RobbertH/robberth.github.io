// ==UserScript==
// @name         Crack Go & Proceed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://colruyt.collectandgo.be/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("CRACK & PROCEED --------------------------");
    if (window.location.href.indexOf("bobbie") > -1){ // URL was modified by Crack & Go script
        console.log("werkt");
        var artikz = document.querySelector("#articles").firstChild.firstChild; // buy first item once
        console.log("te nice");
        artikz.lastChild.lastChild.firstChild.firstChild.submit()
    }
    window.close();

    console.log("CRACK & PROCEED --------------------------");
})();
