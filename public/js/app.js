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
    clearInterval(loadcheck);
    locationMessage.textContent = "";
    imgMessage.textContent = "";
    responseMessage.textContent = "";
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
                    pressure
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
                    if (imgError) imgMessage.textContent = imgError + ".Try search again";
                    else {
                        var i = 0;
                        downloadingImage.src = images[i].sourceUrl;
                        loadcheck = setInterval(() => {
                            i++;
                            console.log(i);
                            if (
                                downloadingImage.complete == false ||
                                image.src ==
                                    "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                            ) {
                                if (i == 2) {
                                    if (
                                        !confirm(
                                            "Couldn't fetch a suitable picture. Do you wish to keep trying?"
                                        )
                                    ) {
                                        image.src = `/img/${icon}.jpg`;
                                        clearInterval(loadcheck);
                                    }
                                } else {
                                    if (i > 8) {
                                        image.src = `/img/${icon}.jpg`;
                                        clearInterval(loadcheck);
                                    }
                                    console.log("Couldn't load image so trying next");
                                    downloadingImage.src = images[i].sourceUrl;
                                }
                            } else clearInterval(loadcheck);
                        }, 9000);
                    }
                }
            );
    });
});
