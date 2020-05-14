// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var port = chrome.runtime.connect();

// event listener for the button inside popup window
document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.getBackgroundPage(function(page){
    if(page.toggle2 == false){
      document.getElementById('myTable').style.display = 'none';
    }
    else{
      document.getElementById('myTable').style.display = 'table';
    }
  })
  document.getElementById("unitOfTime").addEventListener("change", handleEvent);
  document.getElementById("fname").addEventListener("change", handleEvent);
  document.getElementById("toggleInput").addEventListener("change", handleEvent);
  document.getElementById("toggleInput2").addEventListener("change", handleEvent);
  restoreState();
});

function restoreState(){
  const getDocUnitOfTime = document.getElementById("unitOfTime");
  const getDocToggleInput = document.getElementById("toggleInput");
  const getFname = document.getElementById("fname");
  const getMonitorToggleInput = document.getElementById("toggleInput2");
  chrome.runtime.getBackgroundPage(function(page) {
    getDocUnitOfTime.value = page.timeUnit;
    getDocToggleInput.checked = page.toggle;
    getFname.value = page.numTime;
    getMonitorToggleInput.checked = page.toggle2;
  });
}

// Handles event based on its id, used in the event listeners above
function handleEvent(event){
  if(event.target.id == 'unitOfTime'){
    chrome.runtime.sendMessage({varNewUnit: event.target.value, message: 'User changed time unit!'});
  }
  else if(event.target.id == 'fname'){
      chrome.runtime.sendMessage({varNewNumTime: event.target.value, message: 'User changed field value!'})
  }
  else if(event.target.id == 'toggleInput'){
      chrome.runtime.sendMessage({varNewToggle: event.target.checked, message: 'User changed toggle value!'})
  }
  else{
      chrome.runtime.sendMessage({varNewToggleMonitoring: event.target.checked, message: 'User enabled/disabled monitoring!'});
      toggleTable();
  }
}

function toggleTable()
{
   if (document.getElementById("myTable").style.display == "table") {
     document.getElementById("myTable").style.display="none";
   }

   else {
      document.getElementById("myTable").style.display="table";
    }
}
