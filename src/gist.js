var ResultArray = [];

function makeGistRequest() {
    var httpRequest = new XMLHttpRequest();
    var gistUrl = 'https://api.github.com/gists/public'

    if(!httpRequest){
        alert('Cannot create an XMLHttpRequest instance');
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
           if(httpRequest.status == 200){
              clearResults();
              var numPages = GetPages();
              for(var i = 0; i < numPages; i++){
                parseResponse(httpRequest.responseText);
                displayItems(ResultArray, 'results')
              }
            }
           else if(httpRequest.status == 400) {
              alert('There was an error 400')
           }
           else {
               alert('something else other than 200 was returned')
           }
        }
    }

    httpRequest.open("GET", gistUrl, true);
    httpRequest.send(null);
}

function GetPages(){
  var pageElement = document.getElementById("pages");
  return pageElement[pageElement.options.selectedIndex].value;
}

function clearResults(){
  if(ResultArray.length > 0){
    ResultArray.length = 0;
    var resultList = document.getElementById('results');
    while(resultList.firstChild){
      resultList.removeChild(resultList.firstChild);
    };
  };
}


function parseResponse(jsonResponse){
   var parsedJSON = JSON.parse(jsonResponse);
   for(var i = 0; i < parsedJSON.length; i++){
     for(var file in parsedJSON[i].files){
        if(parsedJSON[i].files.hasOwnProperty(file)){
          var firstfile = file;
        break;
        }
      }
        var gistItem = new GistItem(parsedJSON[i].id, parsedJSON[i].description, parsedJSON[i].files[firstfile].language, parsedJSON[i].html_url);
        ResultArray[i] = gistItem;
   }
}

function displayItems(array, location){
   var gistul = document.getElementById(location);

   for(var i = 0; i < ResultArray.length; i++){
     var gistli = document.createElement("li");
     gistli.classList.add("item");
     if(ResultArray[i].GetLanguage() != null){
       gistli.classList.add(ResultArray[i].GetLanguage());
     }
     var itemDiv = document.createElement("div");
     itemDiv.classList.add("item-wrapper");
     itemDiv.innerHTML = '<a href="' + ResultArray[i].url + '">' + ResultArray[i].GetDescription() + '</a>';
     var languageP = document.createElement('p');
     var languageTextNode = document.createTextNode(ResultArray[i].GetLanguage());
     var btnInput = document.createElement('input');
     btnInput.classList.add("btn");
     btnInput.classList.add("btn--add-favorite");
     btnInput.value = "Add to favorites";
     languageP.appendChild(languageTextNode);
     itemDiv.appendChild(languageP);
     itemDiv.appendChild(btnInput);
     gistli.appendChild(itemDiv);
     gistul.appendChild(gistli);
   }
}

function GistItem(id, description, language, url){
  this.id = id;
  this.description = description;
  this.GetDescription = function() {
    if(this.description === null || this.description == undefined)
      return '';
    else
        return this.description;
        };
  this.language = language;
  this.GetLanguage = function(){
    if(this.language === null || this.description == undefined)
      return;
    else
    return this.language.toLowerCase();
    };
  /*this.language = function(languageStr){
    var javascript = false;
    this.json = false;
    this.python = false;
    this.sql = false;
    this.other = false;

    switch(languageStr.toLowerCase()){
      case 'javascript':
        this.javascript = true;
        break;
      case 'json':
        this.json = true;
        break;
      case 'python':
        this.python = true;
        break;
      case 'sql':
        this.sql = true;
        break;
      default:
        this.other = true;
    }*/
  //}

  this.url = url;
}
