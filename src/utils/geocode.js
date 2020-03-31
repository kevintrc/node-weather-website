const request = require("request");

const geocode = (place, callback) => {
    const url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodeURIComponent(place) +
        ".json?access_token=pk.eyJ1Ijoia2V2aW50cmMiLCJhIjoiY2s4NXFnaG1nMDkxZjNnbzd3bGZpeTNvYSJ9.eL0R9TV3uLOWBRk0e5GiIA&limit=1";
    request({ url: url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to connect to location server(mapbox)", undefined);
        } else if (body.features.length === 0) {
            callback("Unable to find location with entered name", undefined);
        } else {
            const country = body.features[0].place_name.split(",");
            const locationNew = body.features[0].text + " ," + country[country.length - 1];
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: locationNew
            });
        }
    });
};

module.exports = geocode;
