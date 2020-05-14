// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';
var timeUnit = 'min';
var toggle = false;
var numTime = 0;
var toggle2 = false;

// # of tabs to delete
var numTabsToDelete = 0;
var startTime, endTime;

var numToStop = 0;
var openTabs = {};
var lastVisited = {};

// might be unnecessary considering openTabs, look into this later
var dateCreated = {};

var timeElapsed = {};

var currentTab = null;
//var current = null;
chrome.runtime.onInstalled.addListener(function() {
	console.log('The extension is running.')
});

chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    console.log("onDisconnect");
		chrome.tabs.query({currentWindow : true, active: true}, function(arrayTabs){
			for(const tab of arrayTabs){
				currentTab = tab.id;
			}
		})
		start();

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



	chrome.tabs.query({currentWindow : true, active: true}, function(arrayTabs){
		for(const tab of arrayTabs){
			console.log("Tab ID: ", tab.id);
			lastVisited[tab.id] = new Date();
			if(timeElapsed[tab.id] == undefined){
				timeElapsed[tab.id] = 0;
					console.log('val: ', timeElapsed[tab.id]);
			}
			else{
				if(tab.id == currentTab){
					console.log("Yessir");
					timeElapsed[tab.id] = timeElapsed[tab.id] + end();
				}

				else{console.log("Nossir")};
			}
		}
	});
});

// DEBUGGING PURPOSES
// Activates when user deletes a tab
chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
	console.log("Deleted ", tabID);
});

// Activates when user toggles on or off for auto-delete functionality
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed toggle value!"){
			toggle = request.varNewToggle;
		}
	});


// Activates when user modifies time unit from dropdown-menu
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed time unit!"){
			timeUnit = request.varNewUnit;
		}
	});

// Activates when user modifies text field value
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed field value!"){
			numTime = request.varNewNumTime;
			//console.log("New field value is: ", numTime)
		}
	});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.message == 'User enabled/disabled monitoring!'){
			console.log("monitoring");
			toggle2 = request.varNewToggleMonitoring;
		}
	}
)

// Need to set to work only if toggle is on for monitoring
chrome.tabs.onActivated.addListener(function(activeInfo){
	var currentTab = activeInfo.tabId;
	lastVisited[currentTab] = new Date();
	// let previous = current;
	// current = activeInfo.tabId;
	// if(!(previous in timeElapsed)){
	// 	timeElapsed[previous] = 0;
	// 	console.log("Not in timeElapsed");
	// }
	// timeElapsed[previous] = timeElapsed[previous] + end();
	// lastVisited[current] = new Date();
	// start();
});



// Deletes function after a user-specified amount of time
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

// Starts stopwatch of tab
function start() {
  startTime = performance.now();
};

// Ends stopwatch of tab
function end() {
  endTime = performance.now();
  let timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  let seconds = Math.round(timeDiff);
	return seconds;
}

// Argument: seconds
// Return: Time in hour::minute::second format
function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}
