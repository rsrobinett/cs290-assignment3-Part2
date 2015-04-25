function loadgist() {
    console.log("gist.js is found.")
}


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

  var parsedText = JSON.Parse(jsonResponse, function(k){return k;});

   var body = document.getElementsByTagName("body")[0];
   var element = document.createElement("div");
   var text = document.createTextNode(parsedText);

   element.appendChild(text);

   body.appendChild(element);
}
