'use strict';
//document.getElementById("Tester").addEventListener("click", function(){

  //
  //chrome.runtime.sendMessage({message: 'User clicked refresh!'});

const d = document.getElementById("Tester");
let tableBody = document.getElementById("myTable_body");
tableBody.innerHTML = '';

chrome.tabs.query({currentWindow : true}, function(arrayOfTabs){
  for(const tab of arrayOfTabs)
  {
    const row = tableBody.insertRow(-1)
    const cell1 = row.insertCell(0);
    cell1.innerHTML = tab.title;
    cell1.className = 'titleName';

    const cell2 = row.insertCell(1);
    cell2.innerHTML = "";
    cell2.className = 'titleName';

    const cell3 = row.insertCell(2);
    cell3.innerHTML = "";
    cell3.className = 'titleName';


    chrome.runtime.getBackgroundPage(function(page){
      if(page.lastVisited[tab.id] != undefined){
        cell2.innerHTML = dateToString(page.lastVisited[tab.id]);
      }

      if(page.timeElapsed[tab.id] != undefined){
        cell3.innerHTML = page.timeElapsed[tab.id];
      }
    });
  }
});


function dateToString(dateObject){
  const year = dateObject.getFullYear();

  // Not sure who the genius was that decided to make months 0-based...
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();
  let hour = dateObject.getHours();

  if(dateObject.getHours() < 10){
     hour = "0" + dateObject.getHours();
  }
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();

  const formattedDate = month + "/" + day + "/" + year;
  const formattedTime = hour + ":" + minutes + ":" + seconds;

  const finishedFormattedString = formattedDate + ", " + formattedTime;
  return finishedFormattedString;
}
// -----------------------------------------------------------------------------
//var tables = document.getElementsByClassName('flexiCol');
var table = document.getElementsByTagName('table')[0];
resizableGrid(table);

function resizableGrid(table) {
 var row = table.getElementsByTagName('tr')[0],
 cols = row ? row.children : undefined;

 if (!cols){
   return;
 }

 //table.style.overflow = 'hidden';

 var tableHeight = table.offsetHeight;

 for (var i=0;i<cols.length;i++){
  var div = createDiv(tableHeight);
  cols[i].appendChild(div);
  cols[i].style.position = 'relative';
  setListeners(div);
 }

 function setListeners(div){
  var pageX,curCol,nxtCol,curColWidth,nxtColWidth;

  div.addEventListener('mousedown', function (e) {
   curCol = e.target.parentElement;
   nxtCol = curCol.nextElementSibling;
   pageX = e.pageX;

   var padding = paddingDiff(curCol);
   curColWidth = curCol.offsetWidth - padding;
  });

  document.addEventListener('mousemove', function (e) {
   if (curCol) {
    var diffX = e.pageX - pageX;

    if (nxtCol){
      nxtCol.style.width = (nxtColWidth - (diffX))+'px';

    }

    curCol.style.width = (curColWidth + diffX)+'px';
   }
  });

  document.addEventListener('mouseup', function (e) {
   curCol = nxtCol = pageX = nxtColWidth =  curColWidth = undefined;
  });
 }

 function createDiv(height){
  var div = document.createElement('div');
  div.style.top = 0;
  div.style.right = 0;
  div.style.width = '5px';
  div.style.position = 'absolute';
  div.style.cursor = 'col-resize';
  div.style.userSelect = 'none';
  div.style.height = '31px';
  return div;
 }

 function paddingDiff(col){

  if (getStyleVal(col,'box-sizing') == 'border-box'){
   return 0;
  }

  var padLeft = getStyleVal(col,'padding-left');
  var padRight = getStyleVal(col,'padding-right');
  return (parseInt(padLeft) + parseInt(padRight));

 }

 function getStyleVal(elm,css){
  return (window.getComputedStyle(elm, null).getPropertyValue(css))
 }
};
