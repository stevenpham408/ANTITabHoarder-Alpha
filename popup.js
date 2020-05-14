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
  restoreState();
});

document.getElementById("unitOfTime").addEventListener("change", function(){
  const d = document.getElementById("unitOfTime");
  chrome.runtime.sendMessage({varNewUnit: d.value, message: 'User changed time unit!'});
});

document.getElementById("toggleInput").addEventListener("change", function(){
  const d = document.getElementById("toggleInput");
  chrome.runtime.sendMessage({varNewToggle: d.checked, message: 'User changed toggle value!'})
});

document.getElementById("fname").addEventListener("change", function(){
  const d = document.getElementById("fname");
  chrome.runtime.sendMessage({varNewNumTime: d.value, message: 'User changed field value!'})
});

document.getElementById("toggleInput2").addEventListener("change", function(){
  const d = document.getElementById("toggleInput2");
  chrome.runtime.sendMessage({varNewToggleMonitoring: d.checked, message: 'User enabled/disabled monitoring!'});
  toggleTable();
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

function toggleTable()
{
   if (document.getElementById("myTable").style.display == "table") {
     document.getElementById("myTable").style.display="none";
   }

     else {
      document.getElementById("myTable").style.display="table";
    }
}
