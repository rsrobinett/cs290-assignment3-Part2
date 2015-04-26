window.onload = function() {
  getStoredFavorites();
  makeGistRequest(1);
};

var ResultArray = [];
var FavoritesArray = [];

function getStoredFavorites() {
  for(var i = 0; i < localStorage.length; i++){
    var jsonFav = JSON.parse(localStorage.getItem(localStorage.key(i)));
    var fav = new GistItem(jsonFav.id, jsonFav.description, jsonFav.language, jsonFav.url);
    FavoritesArray.push(fav);
  }
}

function makeGistRequest(numPages) {
    var httpRequest = new XMLHttpRequest();
    var gistUrl = 'https://api.github.com/gists/public?page=' + numPages;

    if(!httpRequest){
        alert('Cannot create an XMLHttpRequest instance');
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
           if(httpRequest.status == 200){
              parseResponse(httpRequest.responseText);
              displayItems(ResultArray, 'results');
              displayItems(FavoritesArray, 'favorites');
              if(numPages > 1)
                makeGistRequest(numPages - 1);
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

function on_search_button_click(){
  clearResults();
  var numPages = GetPages();
  makeGistRequest(numPages);
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

   for(var i = 0; i < array.length; i++){
     var gistli = document.createElement("li");
     gistli.classList.add("item");
     if(array[i].GetLanguage() != null){
       gistli.classList.add(array[i].GetLanguageClass());
     }
     var itemDiv = document.createElement("div");
     itemDiv.classList.add("item-wrapper");
     itemDiv.innerHTML = '<a href="' + array[i].url + '">' + array[i].GetDescription() + '</a>';
     var languageP = document.createElement('p');
     var languageTextNode = document.createTextNode(array[i].GetLanguage());
     var btnInput = document.createElement('input');
     btnInput.classList.add("btn");
     btnInput.classList.add("btn--add-favorite");
     btnInput.id = array[i].id;
     if(location == 'results') {
       btnInput.value = "Add to favorites";
       btnInput.classList.add("btn--add-favorite");
       btnInput.onclick = AddToFavorites;
      } else if (location == 'favorites') {
       btnInput.value = "Remove";
       btnInput.classList.add("btn--remove-favorite");
       btnInput.onclick = RemoveFromFavorites;
      } else {
       btnInput.value = 'unknown';
     };
     languageP.appendChild(languageTextNode);
     itemDiv.appendChild(languageP);
     itemDiv.appendChild(btnInput);
     gistli.appendChild(itemDiv);
     gistul.appendChild(gistli);
   }
}

function AddToFavorites(){
    var idfav = this.id;
    var gistfav = ResultArray.filter(function(arr){
      return arr.id == idfav;
    });
    var jsonFavorite = JSON.stringify({id: idfav, description: gistfav[0].GetDescription(), language:gistfav[0].GetLanguage(), url: gistfav[0].url });
    localStorage.setItem(idfav, jsonFavorite);
  }

function RemoveFromFavorites(){
  var idfav = this.id;
  localStorage.removeItem(idfav);
}

function GistItem(id, description, language, url){

  this.id = id;
  this.description = description;
  this.language = language;
  this.url = url;

  this.isFavorite = false;

  this.addToFavorites = function(){
    localStorage.setItem(id, description);
    this.isFavorite = true;
  };

  this.removeFromFavorites = function(){
    this.isFavorite = false;
  };

  this.GetDescription = function() {
    if(this.description === null || this.description == undefined)
      return '';
    else
        return this.description;
        };

  this.GetLanguage = function(){
    if(this.language === null || this.language == undefined)
      return;
    else
      return this.language;
  };

  this.GetLanguageClass = function(){
    if(this.language === null || this.language == undefined)
      return;
    else
    switch(this.language.toLowerCase()){
      case 'javascript':
      case 'json':
      case 'python':
      case 'sql':
        return this.language.toLowerCase();
      default:
        return 'other';
    }
  };
}
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
