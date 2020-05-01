// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';
var timeUnit = 'min';
var toggle = false;
var numTime = 0;

// # of tabs to delete
var numTabsToDelete = 0;
var startTime, endTime;

var numToStop = 0;
var openTabs = {};
var lastVisited = {};

// might be unnecessary considering openTabs, look into this later
var dateCreated = {};

var timeElapsed = {};

var current = null;

chrome.runtime.onInstalled.addListener(function() {
	console.log('The extension is running.')
	start();
	chrome.tabs.query({currentWindow : true, active: true}, function(arrayTabs){
		for(const tab of arrayTabs){
			current = tab.id;
			lastVisited[current] = new Date();
			console.log("You're currently in ", tab.id);
		}
	});
});

chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    console.log("onDisconnect")

		chrome.tabs.onCreated.addListener(function(tab){
			dateCreated[tab.id] = new Date();
			if(toggle == true){
				//console.log("New tab created. Tab ID: ", tab.id);
				openTabs[tab.id] = new Date();
				numTabsToDelete = numTabsToDelete + 1;
				console.log(openTabs[tab.id].toString());
				delayedDelete(tab.id);
			}

			// chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
			// 	if(tab.id == tabID && toggle == true){
			// 		console.log("Tab delete detected");
			// 		delete openTabs[tabID];
			// 	}
			// });
		});
		//
  });
  console.log("onConnect");
});

chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
	console.log("Deleted ", tabID);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed toggle value!"){
			toggle = request.varNewToggle;
			//console.log("New toggle value is: ", toggle)
		}
	});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed time unit!"){
			timeUnit = request.varNewUnit;
			//console.log("Sexerito");
		}
	});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed field value!"){
			numTime = request.varNewNumTime;
			//console.log("New field value is: ", numTime)
		}
	});

// Need to set to work only if toggle is on for monitoring
chrome.tabs.onActivated.addListener(function(activeInfo){
	let previous = current;
	current = activeInfo.tabId;
	if(!(previous in timeElapsed)){
		timeElapsed[previous] = 0;
		console.log("Not in timeElapsed");
	}
	timeElapsed[previous] = timeElapsed[previous] + end();
	lastVisited[current] = new Date();
	//console.log("Last visited tab with ID: ", previous, "with elapsed time: ", timeElapsed[previous], "and last visited date: ", lastVisited[previous]);
	//console.log("Currently in tab with ID: ", activeInfo.tabId);
	start();
});

function delayedDelete(tabID){
	var delayedTime;
	if(timeUnit == "min") { delayedTime = numTime * 60000 };
	if(timeUnit == "hr")  { delayedTime = numTime * 3600000 }
	setTimeout(function(){
		if(tabID in openTabs){
			chrome.tabs.remove(tabID)
			//console.log("Time: ", new Date().toString());
		}
	}, delayedTime);
}

function start() {
  startTime = performance.now();
};

function end() {
  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  var seconds = Math.round(timeDiff);
	return seconds;
}

function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}
