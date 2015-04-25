function makeGistRequest() {
    var httpRequest = new XMLHttpRequest();
    var gistUrl = 'https://api.github.com/gists/public'

    if(!httpRequest){
        alert('Cannot create an XMLHttpRequest instance');
    }

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
           if(httpRequest.status == 200){
              parseResponse(httpRequest.responseText);
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

function parseResponse(jsonResponse){
  var arrayLength = 5;
   var parsedJSON = JSON.parse(jsonResponse);
   var resultArray = new Array(arrayLength);

   for(var i = 0; i < parsedJSON.length; i++){
     /*for(var file in parsedJSON[i].files){
        if(parsedJSON[i].files.hasOwnProperty(file)){
          var firstfile = file;
        break;
      }*/
    //  }
        var gistItem = new GistItem(parsedJSON[i].id, parsedJSON[i].description, 'language', parsedJSON[i].html_url);
        resultArray[i] = gistItem;
   }

  // var containerResults = document.getElementsByClassName("container results")[0];
   var gistul = document.getElementById("results");//.createElement("ul");

   for(var i = 0; i < arrayLength; i++){
     var gistli = document.createElement("li");
     gistli.classList.add("item");
     gistli.classList.add(resultArray[i].language);
     var itemDiv = document.createElement("div");
     itemDiv.innerHTML = resultArray[i].description;
     gistli.appendChild(itemDiv);
     gistul.appendChild(gistli);
   }
   //containerResults.appendChild(gistul);

}

function GistItem(id, description, language, url){
  this.id = id;
  this.description = description;
  this.language = language;
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
