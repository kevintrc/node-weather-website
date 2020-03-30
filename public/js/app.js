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

weatherform.addEventListener("submit", (e) => {
    e.preventDefault();
    downloadingImage.src = smallImg = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
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
                    if (imgError) imgMessage.textContent = imgError;
                    else downloadingImage.src = smallImg;
                }
            );
    });
});
