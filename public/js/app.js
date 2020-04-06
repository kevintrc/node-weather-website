const weatherform = document.querySelector("form");
const inputbox = document.querySelector("input");
const responseMessage = document.querySelector("#response");
const imgMessage = document.querySelector("#imgresponse");
const locationMessage = document.querySelector("h3");

var loadcheck;
var globalIMG;
var sources;
var i;

const clear = () => {
   document.getElementById("tap").style.visibility = "hidden";
   document.getElementById("gmaps").style.visibility = "hidden";
   document.getElementById("imgsource").textContent = "";
   locationMessage.textContent = "";
   responseMessage.textContent = "";
   imgMessage.textContent = "";
};

var image = document.images[0];
clear();
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
               latitude,
               longitude,
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
                  downloadingImage.src = `/img/${icon}.jpg`;
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
