// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var numToStop = 0;
function delayedDelete(tab){
	  setTimeout(function(){
		chrome.tabs.remove(tab.id)
    console.log("Time: ", new Date().toString());
	}, 45000);
}

var numToDelete = 0;
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});

var openTabs = {};
chrome.tabs.onCreated.addListener(function(tab) {
  //numToDelete = numToDelete + 1;
  console.log("Tab ID: ", tab.id);
  openTabs[tab.id] = new Date();
  numToDelete = numToDelete + 1;
  console.log(openTabs[tab.id].toString());
  console.log("Length: ", numToDelete);
  delayedDelete(tab);
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
