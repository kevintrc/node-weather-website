const request = require("request");

const forecast = (latitude, longitude, callback) => {
    const url =
        "https://api.darksky.net/forecast/a518c7ec9df1e39a6ec0ceac7c917ef6/" +
        encodeURIComponent(latitude) +
        "," +
        encodeURIComponent(longitude) +
        "?exclude=minutely,hourly,alerts,flags&units=si ";
    request({ url: url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to connect to location server(darksky)", undefined);
        } else if (body.error) {
            callback("Unable to find location with entered geocode", undefined);
        } else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                precipProbability: body.currently.precipProbability,
                humidity: body.currently.humidity,
                pressure: body.currently.pressure,
                windSpeed: body.currently.windSpeed,
                icon: body.currently.icon
            });
        }
    });
};

module.exports = forecast;
