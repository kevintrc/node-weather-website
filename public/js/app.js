const weatherform = document.querySelector("form");
const inputbox = document.querySelector("input");
const responseMessage = document.querySelector("#response");
const imgMessage = document.querySelector("#imgresponse");
const locationMessage = document.querySelector("h3");

var image = document.images[0];
var downloadingImage = new Image();
downloadingImage.onload = function() {
    image.src = this.src;
};
var loadcheck;
weatherform.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(loadcheck);
    locationMessage.textContent = "";
    imgMessage.textContent = "";
    responseMessage.textContent = "";
    // document.body.style.backgroundImage = `url(/img/IMG_0286.jpg)`;
    downloadingImage.src = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
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
                    smallImg,
                    imgError,
                    windSpeed,
                    humidity,
                    icon,
                    pressure
                }) => {
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
                    if (imgError) imgMessage.textContent = imgError + ".Try search again";
                    else downloadingImage.src = smallImg;
                    loadcheck = setTimeout(() => {
                        if (
                            downloadingImage.complete == false ||
                            downloadingImage.src ==
                                "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                        )
                            downloadingImage.src = `/img/${icon}.jpg`;
                    }, 15000);
                }
            );
    });
});
