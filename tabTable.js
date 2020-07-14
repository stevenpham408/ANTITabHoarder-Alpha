'use strict';
import{ sec2time } from './modules/time.js';
const d = document.getElementById("Tester");
let tableBody = document.getElementById("myTable_body");
tableBody.innerHTML = '';
var called = false;

chrome.storage.local.get(null, function(results){
  if(results.toggle2 == true){
    chrome.tabs.query({currentWindow: true, active: true}, function(arrayTabs){
      results.lastVisited[arrayTabs[0].id] = (new Date()).toJSON();
      chrome.storage.local.set({lastVisited: results.lastVisited});
      chrome.runtime.sendMessage({message: 'End the timer!', wasTabTableOn: true}, function(response){
        fillTable();
      });
    })
  }
})
called = true;

// Fills the table in with the corresponding stored data
function fillTable(){
  chrome.tabs.query({currentWindow : true}, function(arrayOfTabs){
    for(const tab of arrayOfTabs)
    {
      // Title column of the table
      const row = tableBody.insertRow(-1)

      const cell1 = row.insertCell(0);
      cell1.innerHTML = tab.title;
      cell1.className = 'titleName';

      // Last visited column of the table
      const cell2 = row.insertCell(1);
      cell2.innerHTML = "";
      cell2.className = 'lastOpened';

      // Time elapsed column of the table
      const cell3 = row.insertCell(2);
      cell3.innerHTML = "";
      cell3.className = 'timeElapsed';

      chrome.storage.local.get(null, function(results){
        if(results.lastVisited[tab.id] != undefined && results.lastVisited[tab.id] != null ){
          cell2.innerHTML = dateToString(new Date(results.lastVisited[tab.id]));
        }
        else{
          cell2.innerHTML = '';
        }

        if(results.timeElapsed[tab.id] != undefined && results.timeElapsed[tab.id] != null){
          cell3.innerHTML = sec2time(results.timeElapsed[tab.id]);
        }
        else{
          cell3.innerHTML = '';
        }
      }) // end chrome.storage.local.get
    }
  })
}


function logCurrentTab(){
  chrome.storage.local.get(null, function(results){
    chrome.tabs.query({currentWindow : true, active : true}, function(arrayOfTabs){
      let currentTab = arrayOfTabs[0];
      results.lastVisited[currentTab.id] = (new Date()).toJSON();
      chrome.storage.local.set( {lastVisited: results.lastVisited} );

      results.timeElapsed[currentTab.id] = 0;
      chrome.storage.local.set({timeElapsed: results.timeElapsed});

      chrome.runtime.sendMessage({message: 'Start the timer!'});

      fillTable();
    })
  })
}

document.getElementById('toggleInput2').addEventListener('change', function(){
  if(document.getElementById('toggleInput2').checked == true){
    logCurrentTab();
  }

  else{
    called = false;
    let table = document.getElementById('myTable');

    chrome.tabs.query({currentWindow: true}, function(arrayOfTabs){
      chrome.storage.local.get(null, function(results){
        results.lastVisited = {};
        chrome.storage.local.set({lastVisited: results.lastVisited});
        results.timeElapsed = {};
        chrome.storage.local.set({timeElapsed: results.timeElapsed});
      })
    })

    while(table.rows.length > 1){
      table.deleteRow(1);
    }
  }
})

function dateToString(dateObject){
  const year = dateObject.getFullYear();

  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();
  let hour = dateObject.getHours();

  if(dateObject.getHours() < 10){
     hour = "0" + dateObject.getHours();
  }

  let minutes = dateObject.getMinutes();
  let seconds = dateObject.getSeconds();


  if(dateObject.getMinutes() < 10){
     minutes = "0" + dateObject.getMinutes();
  }

  if(dateObject.getSeconds() < 10){
     seconds = "0" + dateObject.getSeconds();
  }

  const formattedDate = month + "/" + day + "/" + year;
  const formattedTime = hour + ":" + minutes + ":" + seconds;

  const finishedFormattedString = formattedDate + ", " + formattedTime;
  return finishedFormattedString;
}
// -----------------------------------------------------------------------------
var table = document.getElementById('myTable');
var isMouseDown = null;
var startDirection = null;
var startingRow = null;
let mY = 0;
table.onmousedown = function(ev) {
  if(ev.which == 1){
    mY = ev.pageY;
    isMouseDown = true;
    let i = ev.target.parentElement.rowIndex;
    if(table.rows[i] != undefined && i > 0 ){
      unhighlightRows(table);
      startingRow = i;
      table.rows[i].classList.toggle('highlighted');
    }
    return false
  }
};

table.onmouseup = function() {
  startDirection = null;
  isMouseDown = false;
}

let selectedArray = [];
table.onmouseover = function(ev) {
  // If user is still holding left click
  if (isMouseDown == true) {
    // If user is moving cursor up
    if(ev.pageY < mY && startDirection == null){
      startDirection = 1;
    }
    else if(ev.pageY > mY && startDirection == null){
      startDirection = 0;
    }

    var index = ev.target.parentElement.rowIndex;
    if (index != undefined && index > 0) {
      unhighlightRows(table);
      hightlightUntil(index, startDirection);
    }
  }
};

//---------------------------------------------------------------//
function unhighlightRows(aTable){
  if(table.getElementsByClassName('highlighted').length > 0){
    while(table.getElementsByClassName('highlighted')[0]){
      table.getElementsByClassName('highlighted')[0].classList.remove('highlighted');
      }
  }
}

function hightlightUntil(rowIndex, direction){
  if(direction == 0){
    for(let i = startingRow; i <= rowIndex; i++){
      table.rows[i].classList.toggle('highlighted');
    }
  }
  else if(direction == 1){
    for(let i = startingRow; i >= rowIndex; i--){
      table.rows[i].classList.toggle('highlighted');
    }
  }

}

//---------------------------------------------------------------//
resizableGrid(table);
function resizableGrid(table) {
 var row = table.getElementsByTagName('tr')[0],
 cols = row ? row.children : undefined;
 if (!cols){
   return;
 }
 var tableHeight = table.offsetHeight;

 for (var i=0;i<cols.length;i++){
  var div = createDiv(tableHeight);
  cols[i].appendChild(div);
  cols[i].style.position = 'relative';
  setListeners(div);
 }
//---------------------------------------------------------------//
 function setListeners(div){
  var pageX,curCol,nxtCol,curColWidth,nxtColWidth;

  div.addEventListener('mousedown', function (e) {
   curCol = e.target.parentElement;
   nxtCol = curCol.nextElementSibling;
   pageX = e.pageX;

   curColWidth = curCol.offsetWidth;
  });

  document.addEventListener('mousemove', function (e) {
    if (curCol) {
      var diffX = e.pageX - pageX;
      if((curColWidth + diffX > 30) && (curColWidth + diffX < 250)){
        curCol.style.width = (curColWidth + diffX)+'px';
      }
    }
  });

 document.addEventListener('mouseup', function (e) {
   curCol = nxtCol = pageX = nxtColWidth =  curColWidth = undefined;
 });
}
//------------------------------------------------------------------------//
 function createDiv(height){
  var div = document.createElement('div');
  div.style.bottom = '1px';
  div.style.right = 0;
  div.style.borderRight = '2px solid gray';
  div.style.position = 'absolute';
  div.style.cursor = 'col-resize';
  div.style.userSelect = 'none';
  div.style.height = '18px';
  return div;
 }
};
