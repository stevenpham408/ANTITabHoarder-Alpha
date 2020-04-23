// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


'use strict';

var numToStop = 0;
var timeUnit;
var toggle;

function delayedDelete(tab){
	console.log("delayedDelete");
	console.log(timeUnit);
	setTimeout(function(){
		chrome.tabs.remove(tab.id)
		console.log("Time: ", new Date().toString());
	}, 5000 );
}

var numToDelete = 0;

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log("The extension is running.");
	});

	// chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	// 	chrome.declarativeContent.onPageChanged.addRules([{
	// 		conditions: [new chrome.declarativeContent.PageStateMatcher({
	// 			pageUrl: {hostEquals: 'developer.chrome.com'},
	// 		})],
	// 		actions: [new chrome.declarativeContent.ShowPageAction()]
	// 	}]);
	// });
});

var openTabs = {};
chrome.tabs.onCreated.addListener(function(tab) {
  //numToDelete = numToDelete + 1;
  console.log("Tab ID: ", tab.id);
  openTabs[tab.id] = new Date();
  numToDelete = numToDelete + 1;
  console.log(openTabs[tab.id].toString());
  console.log("Length: ", numToDelete);
	while(toggle == true)
	{
		delayedDelete(tab);
	}
});

chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {
  if (openTabs[tabID]) {
    console.log("Removing tab with ID: ", tabID);
    delete openTabs[tabID]
  }
  else{
    console.log("Else: ")
  }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.message == "Sending selected time and toggle option")
      sendResponse({received: "Received selected time option"});
			timeUnit = request.varTime;
			toggle = request.varToggle;
			console.log("Sex", timeUnit, toggle);
			return true;
  });


// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.message == "Sending selected toggle option")
//       sendResponse({received: "Received toggle time option"});
// 			toggle = request.varToggle;
// 			console.log("Hump", toggle );
//   });
