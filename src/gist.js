window.onload = function() {
  getStoredFavorites();
  displayItems(FavoritesArray, 'favorites');
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
  ClearResults();
  var numPages = GetPages();
  makeGistRequest(numPages);
}

function GetPages(){
  var pageElement = document.getElementById("pages");
  return pageElement[pageElement.options.selectedIndex].value;
}

function ClearResults(){
  if(ResultArray.length > 0){
    ResultArray.length = 0;
    var resultList = document.getElementById('results');
    resultList.innerHTML = '';
    /*
    for(var i = 0; i < resultList.length; i++){
      if(resultList[i].id){
        RemoveFromView(resultList[i].id);
      }
      //resultList.removeChild(resultList.firstChild);
    };
    */
  };
}


function parseResponse(jsonResponse){
   var parsedJSON = JSON.parse(jsonResponse);
   var resultArrayLength = ResultArray.length;
   for(var i = 0; i < parsedJSON.length; i++){
     for(var file in parsedJSON[i].files){
        if(parsedJSON[i].files.hasOwnProperty(file)){
          var firstfile = file;
        break;
        }
      }
        var gistItem = new GistItem(parsedJSON[i].id, parsedJSON[i].description, parsedJSON[i].files[firstfile].language, parsedJSON[i].html_url);
        ResultArray[i + resultArrayLength] = gistItem;

       if(FavoritesArray.some(function (element, index, array){
         if (element.id == gistItem.id){
           return true;
         }
         return false;
       })){
         ResultArray[i + resultArrayLength].isFavorite = true;
       }

   }
}

function displayItems(array, location){
   var gistul = document.getElementById(location);

   for(var i = 0; i < array.length; i++){
     if(location == 'favorites' || !localStorage.getItem(array[i].id)){
       displayItem(gistul, array[i], location);
     }
   }
}

function displayItem(parentElement, newItem, location){
  var gistli = document.createElement("li");
  gistli.classList.add("item");
  gistli.id =  newItem['id'];
  if(newItem.GetLanguage() != null){
    gistli.classList.add(newItem.GetLanguageClass());
  }
  var itemDiv = document.createElement("div");
  itemDiv.classList.add("item-wrapper");
  itemDiv.innerHTML = '<a href="' + newItem.url + '">' + newItem.GetDescription() + '</a>';
  var languageP = document.createElement('p');
  var languageTextNode = document.createTextNode(newItem.GetLanguage());
  var btnInput = document.createElement('input');
  btnInput.classList.add("btn");
  btnInput.classList.add("btn--add-favorite");
  btnInput.setAttribute('gistId',  newItem.id);
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
  parentElement.appendChild(gistli);
}

function AddToFavorites(){
    var idfav = this.getAttribute('gistid');
    var gistfav = ResultArray.filter(function(arr){
      return arr.id == idfav;
    });

    var jsonFavorite = JSON.stringify({id: idfav, description: gistfav[0].GetDescription(), language:gistfav[0].GetLanguage(), url: gistfav[0].url });
    localStorage.setItem(idfav, jsonFavorite);

    RemoveFromView(idfav);

    var favoriteGistList = document.getElementById('favorites');
    displayItem( favoriteGistList ,gistfav[0], 'favorites');


  /*
    var gistToRemove = document.getElementById(idfav);
    var gistResultParent = document.getElementById('results');

    if(gistResultParent){
      gistResultParent.removeChild(gistToRemove);
      if(document.getElementById('favorites') && !document.getElementById(idfav)){
        var favoriteGistList = document.getElementById('favorites');
        displayItem( favoriteGistList ,gistfav[0], 'favorites')
      }
    }
*/

  }

function RemoveFromView(elementid){
  var gistToRemove = document.getElementById(elementid);
  if(gistToRemove){
    gistToRemove.removeAttribute("class");
    gistToRemove.setAttribute("display", "none");
    gistToRemove.setAttribute("class","removed");
    gistToRemove.innerHTML = '';
    gistToRemove.removeAttribute("id");
  }
}

function RemoveFromFavorites(){
  var idfav = this.getAttribute('gistid');
  localStorage.removeItem(idfav);
  RemoveFromView(idfav);
}

function GistItem(id, description, language, url){

  this.id = id;
  this.description = description;
  this.language = language;
  this.url = url;

  this.isFavorite = false;

  this.GetDescription = function() {
    return this.description || "No description Available";
  };

  this.GetLanguage = function(){
    return this.language || ' ';
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
