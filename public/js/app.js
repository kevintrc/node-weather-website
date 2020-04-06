const weatherform = document.querySelector("form");
const inputbox = document.querySelector("input");
const responseMessage = document.querySelector("#response");
const imgMessage = document.querySelector("#imgresponse");
const locationMessage = document.querySelector("h3");

var image = document.images[0];
document.getElementById("tap").style.visibility = "hidden";
var downloadingImage = new Image();
downloadingImage.onload = function () {
   image.src = this.src;
   document.getElementById("tap").style.visibility = "visible";
};

var loadcheck;
var globalIMG;
var i;

const play = () => {
   image.src = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
   document.getElementById("tap").style.visibility = "hidden";
   i++;
   downloadingImage.src = globalIMG[i];
   loadcheck;
};

weatherform.addEventListener("submit", (e) => {
   e.preventDefault();
   clearInterval(loadcheck);
   locationMessage.textContent = "";
   imgMessage.textContent = "";
   responseMessage.textContent = "";
   image.src = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
   document.getElementById("tap").style.visibility = "hidden";
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
               if (error) responseMessage.textContent = error;
               else {
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
               } else {
                  globalIMG = images.map((a) => a.sourceUrl);
                  i = 0;
                  images[99].sourceUrl = `/img/${icon}.jpg`;
                  downloadingImage.src = images[i].sourceUrl;
                  loadcheck = setInterval(() => {
                     if (
                        image.src == "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
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
