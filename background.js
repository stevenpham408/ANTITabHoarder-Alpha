// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});

var openTabs = {};
chrome.tabs.onCreated.addListener(function(tab) {
  openTabs[tab.id] = new Date();
  console.log(openTabs[tab.id].toString());
});


chrome.tabs.onRemoved.addListener(function(tab) {
  if (openTabs[tab.id]) {
    delete openTabs[tab.id]
  }

  console.log("Removing a tab.");
});
