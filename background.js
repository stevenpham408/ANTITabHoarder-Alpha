// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';
import{ start, end } from './modules/time.js';

var startTime, endTime;

initializeState();
updateState();

function initializeState(){
	chrome.storage.local.set({timeUnit: 'min'});
	chrome.storage.local.set({numTime: 0});
	chrome.storage.local.set({toggle: false});
	chrome.storage.local.set({toggle2: false});
	chrome.storage.local.set({lastVisited: {} });
	chrome.storage.local.set({timeElapsed: {} });
	chrome.storage.local.set({tabsToDelete: {} });
}

chrome.runtime.onConnect.addListener(function (externalPort){
	console.log('Connected.');
	chrome.tabs.query({currentWindow: true, active: true}, function(arrayTabs){
		previousTab = arrayTabs[0].id;
	})
});

chrome.tabs.onCreated.addListener(function(tab){
		chrome.storage.local.get(null, function(results){
			if(results.toggle == true){
			results.tabsToDelete[tab.id] = new Date().toString();
			chrome.storage.local.set({tabsToDelete: results.tabsToDelete});
			console.log('Debug #1 ', tab.id, results.tabsToDelete);
			delayedDelete(tab.id);
		}
	})
});

chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
	chrome.storage.local.get(null, function(results){
		if(results.tabsToDelete.hasOwnProperty(tabID) && results.toggle == true){
				delete results.tabsToDelete[tabID];
				chrome.storage.local.set({tabsToDelete: results.tabsToDelete});
		}
	});
});



function updateState(){
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
		if(request.message == 'User changed time unit!'){
			chrome.storage.local.set({timeUnit: request.varNewUnit});
			console.log('Unit of time changed to: ', request.varNewUnit);
		}
		else if(request.message == 'User changed field value!'){
			chrome.storage.local.set({numTime: request.varNewNumTime});
			console.log('Field value changed. to: ', request.varNewNumTime);
		}
		else if(request.message == 'User toggled Delayed Delete!'){
			chrome.storage.local.set({toggle: request.varNewToggle});
			console.log('Delay Delete toggle changed to: ', request.varNewToggle);
		}

		else if(request.message == 'User toggled Tab Monitoring!'){
			chrome.storage.local.set({toggle2: request.varNewToggleMonitoring});
			console.log('Tab Monitoring toggle changed to: ', request.varNewToggleMonitoring);
		}

		else if(request.message == 'Start the timer!'){
			startTime = start();
		}

		else if(request.message == 'End the timer!'){
			chrome.storage.local.get(null, function(results){
				//alert('1');
				sendResponse({response: 'Received'});
			    chrome.tabs.query({currentWindow: true, active: true}, function(arrayTabs){
			      results.timeElapsed[arrayTabs[0].id] =  results.timeElapsed[arrayTabs[0].id] + end(endTime, startTime);
			      chrome.storage.local.set({timeElapsed: results.timeElapsed});
						startTime = start();
			    })
			})
		return true;
		}
	});
}

updateLastVisited();
function updateLastVisited(){
// Need to set to work only if toggle is on for monitoring
	chrome.tabs.onActivated.addListener(function(activeInfo){
		chrome.storage.local.get(null, function(results){
				if(results.toggle2 == true){
					let currentTab = activeInfo.tabId;
					console.log('Switched to Tab: ', currentTab);
					results.lastVisited[currentTab] = (new Date()).toJSON();
					chrome.storage.local.set( {lastVisited: results.lastVisited} );

				}
			})
		})
}

updateTimeElapsedOnTabChange();
function updateTimeElapsedOnTabChange(){
	chrome.tabs.query({currentWindow: true, active: true}, function(arrayOfTabs){
		// alert('previous 1 ' + arrayOfTabs[0].id);
		let previous = arrayOfTabs[0].id;
		chrome.tabs.onActivated.addListener(function(activeInfo){

			let current = activeInfo.tabId;

			chrome.storage.local.get(null, function(results){

				results.timeElapsed[previous] = results.timeElapsed[previous] + end(endTime, startTime);
				chrome.storage.local.set({timeElapsed: results.timeElapsed});

				// Initialize current tab with 0 if it doesn't have a value
				if(results.timeElapsed[current] == null || results.timeElapsed[current] == undefined){
					results.timeElapsed[current] = 0;
					startTime = start();
					chrome.storage.local.set({timeElapsed: results.timeElapsed});
				}

				previous = current;


			})
 		})
	})
}
// Deletes function after a user-specified amount of time
function delayedDelete(tabID){
	let delayedTime;

	chrome.storage.local.get(null, function(results){
		if(results.timeUnit == "min") { delayedTime = results.numTime * 60000 };
		if(results.timeUnit == "hr")  { delayedTime = results.numTime * 3600000 };
		chrome.storage.local.get(null, function(results){
			setTimeout(function(){
				chrome.storage.local.get(null, function(results){
					if(tabID in results.tabsToDelete){
						chrome.tabs.remove(tabID)
					}
				})
			}, delayedTime);

		})
	})
}
