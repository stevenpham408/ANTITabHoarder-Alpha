import{ sec2time } from './modules/time.js';

'use strict';

const d = document.getElementById("Tester");
let tableBody = document.getElementById("myTable_body");
tableBody.innerHTML = '';
var called = false;

chrome.storage.local.get(null, function(results){
  if(results.toggle2 == true){
    chrome.tabs.query({currentWindow: true, active: true}, function(arrayTabs){
      results.lastVisited[arrayTabs[0].id] = (new Date()).toJSON();
      chrome.storage.local.set({lastVisited: results.lastVisited});
      chrome.runtime.sendMessage({message: 'End the timer!'}, function(response){
        fillTable();
      } );
    })
  }
})
called = true;


function fillTable(){
  chrome.tabs.query({currentWindow : true}, function(arrayOfTabs){
    for(const tab of arrayOfTabs)
    {
      const row = tableBody.insertRow(-1)
      const cell1 = row.insertCell(0);
      cell1.innerHTML = tab.title;
      cell1.className = 'titleName';

      const cell2 = row.insertCell(1);
      cell2.innerHTML = "";
      cell2.className = 'lastOpened';

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

      // chrome.storage.local.get(null, function(results){
      //   if(results.timeElapsed[tab.id] != undefined && results.timeElapsed[tab.id] != null){
      //
      //   }
      // })

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
        for(const tab of arrayOfTabs){
          results.lastVisited[tab.id] = null;
          chrome.storage.local.set({lastVisited: results.lastVisited});
        }
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
var row = table.rows[0]
table.onclick = function(ev){
  var index = ev.target.parentElement.rowIndex;
  if(index != undefined){
    if(document.getElementById('myTable').rows[index].style.backgroundColor == ''){
      document.getElementById('myTable').rows[index].style.backgroundColor = '#ddd'
    }
    else{
      document.getElementById('myTable').rows[index].style.backgroundColor = '';
    }
  }
}
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
//---------------------------------------------------------------------------------------------------------
function highlight(){
  alert('highlight')
  let table = document.getElementById('myTable');
  for(let i = 0; i < table.rows.length; i++){
      table.rows[i].style.backgroundColor = '#ddd';
  }
}

function unhighlight(){
  alert('unhighlight')
  let table = document.getElementById('myTable');
  for(let i = 0; i < table.rows.length; i++){
    table.rows[i].onclick = function(){
      console.log("Row has been clicked2")
      table.rows[i].style.backgroundColor = '#ddd';
    }

  }
}
