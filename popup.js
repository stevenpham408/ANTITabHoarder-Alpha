// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var toggle;

let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});



var selectedTimeUnit = document.getElementById("unitOfTime");
var selectedTimeUnit_val = selectedTimeUnit.options[selectedTimeUnit.selectedIndex].value;
var selectedToggleOption = document.getElementById("toggleInput");
var selectedToggleOption_val = selectedToggleOption.checked;

chrome.runtime.sendMessage({varTime: selectedTimeUnit_val, varToggle:selectedToggleOption_val, message: "Sending selected time and toggle option"});


// var selectedToggleOption = document.getElementById("toggleInput");
// // alert(selectedToggleOption.checked);
// var selectedToggleOption_val = selectedToggleOption.checked;
// chrome.runtime.sendMessage({varToggle: selectedToggleOption_val, message: "Sending selected toggle option"});
// // var selectedToggleOption_val = selectedToggleOption.options[selectedToggleOption.selectedIndex].value;
