console.log("Client side Script loaded");

const weatherform = document.querySelector("form");
const inputbox = document.querySelector("input");
const responseMessage = document.querySelector("#response");
const locationMessage = document.querySelector("h3");

var image = document.images[0];
var downloadingImage = new Image();
downloadingImage.onload = function() {
    image.src = this.src;
};

weatherform.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/weather?address=" + encodeURIComponent(inputbox.value)).then(
        (response) => {
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
                        imgError
                    }) => {
                        if (error) responseMessage.textContent = error;
                        else {
                            locationMessage.textContent = location;
                            responseMessage.textContent = `
                    ${summary}
                    Temperature is ${temperature} degree celsius and there is ${precipProbability}% chance of rain`;
                        }
                        if (imgError) downloadingImage.alt = imgError;
                        else downloadingImage.src = smallImg;
                    }
                );
        }
    );
});
