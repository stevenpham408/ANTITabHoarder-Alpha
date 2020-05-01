'use strict';

document.getElementById("Tester").addEventListener("click", function(){
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
      const cell2 = row.insertCell(1);
      cell2.innerHTML = "";
      const cell3 = row.insertCell(2);
      cell3.innerHTML = "";

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
