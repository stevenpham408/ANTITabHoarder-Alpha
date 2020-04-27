// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

var timeUnit = 'min';
var toggle = false;
var numTime = 0;

// # of tabs to delete
var numTabsToDelete = 0;

var numToStop = 0;
var openTabs = {};

chrome.runtime.onInstalled.addListener(function() {
	console.log('The extension is running.')
});

chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    console.log("onDisconnect")

		chrome.tabs.onCreated.addListener(function(tab){
			if(toggle == true){
				console.log("New tab created. Tab ID: ", tab.id);
				openTabs[tab.id] = new Date();
				numTabsToDelete = numTabsToDelete + 1;
				console.log(openTabs[tab.id].toString());
				delayedDelete(tab.id);
			}

			chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
				if(tab.id == tabID && toggle == true){
					console.log("Tab delete detected");
					delete openTabs[tabID];
				}
			});
		});
		//
  });
  console.log("onConnect")
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed toggle value!"){
			toggle = request.varNewToggle;
			console.log("New toggle value is: ", toggle)
		}
	});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed time unit!"){
			timeUnit = request.varNewUnit;
			console.log("Sexerito");
		}
	});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "User changed field value!"){
			numTime = request.varNewNumTime;
			console.log("New field value is: ", numTime)
		}
	});


function delayedDelete(tabID){
	var delayedTime;
	if(timeUnit == "min") { delayedTime = numTime * 60000 };
	if(timeUnit == "hr")  { delayedTime = numTime * 3600000 }
	setTimeout(function(){
		if(tabID in openTabs){
			chrome.tabs.remove(tabID)
			console.log("Time: ", new Date().toString());
		}
	}, delayedTime);
}
