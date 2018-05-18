// ==UserScript==
// @name     Youtube reload
// @version  1
// @include	 https://www.youtube.com/*
// @grant    none
// ==/UserScript==

var reloadAutomatically = true; // set false for fixed interval reloading

// FIXED INTERVAL RELOADING
var fixedReloadMinutes = 0;
var fixedReloadSeconds = 3;

function getFixedInterval(minutes, seconds){
	return (minutes*60+seconds)*1000;
}

// AUTOMATIC RELOADING
function getVideoLength(){
  var durationString = document.getElementsByClassName("ytp-time-duration")[0].textContent;
  var durationArray = durationString.split(":");
  var minutes = parseInt(durationArray[0]);
  var seconds = parseInt(durationArray[1]);
  return (60*minutes+seconds)*1000;
}


function reloadPage(){
  console.log("reloading");
  location.reload();
}


if (reloadAutomatically){
	setTimeout(reloadPage, getVideoLength());
}
else {
	setTimeout(reloadPage, getFixedInterval(fixedReloadMinutes,fixedReloadSeconds));
}
