const weatherform = document.querySelector("form");
const inputbox = document.querySelector("input");
const responseMessage = document.querySelector("#response");
const imgMessage = document.querySelector("#imgresponse");
const locationMessage = document.querySelector("h3");
const suggestionlist = document.querySelectorAll("#list a");

var loadcheck;
var globalIMG;
var sources;
var suggestionsglobal;
var i;

const clear = () => {
   document.getElementById("tap").style.visibility = "hidden";
   document.getElementById("gmaps").style.visibility = "hidden";
   document.getElementById("list").style.display = "none";
   document.getElementById("imgsource").textContent = "";
   locationMessage.textContent = "";
   responseMessage.textContent = "";
   imgMessage.textContent = "";
};
clear();
var image = document.images[0];
var downloadingImage = new Image();

downloadingImage.onload = function () {
   image.src = this.src;
   document.getElementById("imgsource").textContent = "Image fetched from : " + sources[i];
   document.getElementById("tap").style.visibility = "visible";
};

const play = () => {
   image.src = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
   document.getElementById("tap").style.visibility = "hidden";
   document.getElementById("imgsource").textContent = "";
   i++;
   downloadingImage.src = globalIMG[i];
   loadcheck;
};

const suggest = () => {
   fetch("/suggest?address=" + encodeURIComponent(inputbox.value)).then((response) => {
      response.json().then(({ error, suggestions } = {}) => {
         if (error) return (responseMessage.textContent = error);
         suggestionsglobal = suggestions;
         const places = suggestions.map((s) => s.place_name);
         for (let k = 0; k < places.length; k++) {
            suggestionlist[k].innerText = places[k];
            suggestionlist[k].parentElement.style.display = "block";
         }
         for (let k = places.length; k < 5; k++)
            suggestionlist[k].parentElement.style.display = "none";
         document.getElementById("list").style.display = "block";
      });
   });
};

const submitSuggest = (placeName) => {
   image.src = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
   document.getElementById("tap").style.visibility = "hidden";
   document.getElementById("gmaps").style.visibility = "hidden";
   document.getElementById("imgsource").textContent = "";
   locationMessage.textContent = "";
   responseMessage.textContent = "";
   imgMessage.textContent = "";
   const index = suggestionsglobal.map((s) => s.place_name).indexOf(placeName.innerText);
   var locationNew = suggestionsglobal[index].text;
   if (suggestionsglobal[index].context) {
      const place_ext = suggestionsglobal[index].context.map((obj) => {
         return obj.text;
      });
      while (place_ext.length > 3) place_ext.shift();
      locationNew += ", " + place_ext.join(", ");
   }
   const latitude = suggestionsglobal[index].center[1];
   const longitude = suggestionsglobal[index].center[0];
   fetch(
      "/suggestweather?latitude=" +
         encodeURIComponent(latitude) +
         "&longitude=" +
         encodeURIComponent(longitude) +
         "&location=" +
         encodeURIComponent(locationNew)
   ).then((response) => {
      response
         .json()
         .then(
            ({
               error,
               summary,
               temperature,
               precipProbability,
               location,
               images,
               imgError,
               windSpeed,
               humidity,
               icon,
               pressure,
            } = {}) => {
               if (error) return (responseMessage.textContent = error);
               else {
                  document.getElementById("gmaps").href =
                     "https://www.google.com/maps/search/?api=1&query=" +
                     encodeURIComponent(location);
                  document.getElementById("gmaps").style.visibility = "visible";
                  locationMessage.textContent = location;
                  responseMessage.textContent =
                     `${summary}\r\n \r\n` +
                     `Temperature : ${temperature}°C | ` +
                     `${precipProbability}% chance of rain | ` +
                     `Humidity : ${humidity}%  | ` +
                     `Pressure : ${pressure} atm | ` +
                     `Wind speed : ${windSpeed} m/s`;
               }
               if (imgError) {
                  imgMessage.textContent = imgError + ".Default image for weather loaded";
                  image.src = `/img/${icon}.jpg`;
                  document.getElementById("tap").style.visibility = "hidden";
               } else {
                  globalIMG = images.map((a) => a.sourceUrl);
                  sources = images.map((a) => a.source);
                  i = 0;
                  images[99].sourceUrl = `/img/${icon}.jpg`;
                  downloadingImage.src = images[i].sourceUrl;
                  loadcheck = setInterval(() => {
                     if (
                        image.src == "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" &&
                        !imgError
                     ) {
                        i = (i + 1) % 100;
                        console.log("X " + (i - 1) + " so trying next");
                        downloadingImage.src = images[i].sourceUrl;
                     } else {
                        clearInterval(loadcheck);
                     }
                  }, 9000);
               }
            }
         );
   });
};

inputbox.addEventListener("click", () => {
   inputbox.value = "";
});

weatherform.addEventListener("submit", (e) => {
   e.preventDefault();
   clearInterval(loadcheck);
   clear();
   image.src = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
   fetch("/weather?address=" + encodeURIComponent(inputbox.value)).then((response) => {
      response
         .json()
         .then(
            ({
               error,
               summary,
               temperature,
               precipProbability,
               location,
               images,
               imgError,
               windSpeed,
               humidity,
               icon,
               pressure,
            } = {}) => {
               if (error) return (responseMessage.textContent = error);
               else {
                  document.getElementById("gmaps").href =
                     "https://www.google.com/maps/search/?api=1&query=" +
                     encodeURIComponent(location);
                  document.getElementById("gmaps").style.visibility = "visible";
                  locationMessage.textContent = location;
                  responseMessage.textContent =
                     `${summary}\r\n \r\n` +
                     `Temperature : ${temperature}°C | ` +
                     `${precipProbability}% chance of rain | ` +
                     `Humidity : ${humidity}%  | ` +
                     `Pressure : ${pressure} atm | ` +
                     `Wind speed : ${windSpeed} m/s`;
               }
               if (imgError) {
                  imgMessage.textContent = imgError + ".Default image for weather loaded";
                  image.src = `/img/${icon}.jpg`;
                  document.getElementById("tap").style.visibility = "hidden";
               } else {
                  globalIMG = images.map((a) => a.sourceUrl);
                  sources = images.map((a) => a.source);
                  i = 0;
                  images[99].sourceUrl = `/img/${icon}.jpg`;
                  downloadingImage.src = images[i].sourceUrl;
                  loadcheck = setInterval(() => {
                     if (
                        image.src == "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" &&
                        !imgError
                     ) {
                        i = (i + 1) % 100;
                        console.log("X " + (i - 1) + " so trying next");
                        downloadingImage.src = images[i].sourceUrl;
                     } else {
                        clearInterval(loadcheck);
                     }
                  }, 9000);
               }
            }
         );
   });
});
