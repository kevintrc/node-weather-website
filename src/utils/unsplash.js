const request = require("request");

const unsplash = (season, callback) => {
    const url =
        "https://api.unsplash.com/search/photos?client_id=gAiAX1Azd6JifBR3omqk0hd23BdB9XcmoEiLZA2l2pk&per_page=1&query=" +
        encodeURIComponent(season);
    request({ url: url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to connect to location server(unsplash) ..", undefined);
        } else if (body.results.length === 0) {
            callback("Unable to find image for entered place ..", undefined);
        } else {
            callback(undefined, {
                thumbImg: body.results[0].urls.thumb,
                fullImg: body.results[0].urls.full,
                smallImg: body.results[0].urls.small
            });
        }
    });
};

module.exports = unsplash;
