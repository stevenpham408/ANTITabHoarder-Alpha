// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var port = chrome.runtime.connect();
// event listener for the button inside popup window
document.addEventListener('DOMContentLoaded', function() {
  restoreState();
});

document.getElementById("unitOfTime").addEventListener("change", function(){
  var d = document.getElementById("unitOfTime");
  chrome.runtime.sendMessage({varNewUnit: d.value, message: 'User changed time unit!'});
});

document.getElementById("toggleInput").addEventListener("change", function(){
  var d = document.getElementById("toggleInput");
  chrome.runtime.sendMessage({varNewToggle: d.checked, message: 'User changed toggle value!'})
});

document.getElementById("fname").addEventListener("change", function(){
  var d = document.getElementById("fname");
  chrome.runtime.sendMessage({varNewNumTime: d.value, message: 'User changed field value!'})
});

function restoreState(){
  var getDocUnitOfTime = document.getElementById("unitOfTime");
  var getDocToggleInput = document.getElementById("toggleInput");
  var getFname = document.getElementById("fname");
  chrome.runtime.getBackgroundPage(function(page) {
    getDocUnitOfTime.value = page.timeUnit;
    getDocToggleInput.checked = page.toggle;
    getFname.value = page.numTime;
  });

}
