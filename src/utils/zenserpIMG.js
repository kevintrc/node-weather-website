const request = require("request");

const zenserpIMG = (place, ID, callback) => {
    const url =
        "https://app.zenserp.com/api/v2/search?apikey=" +
        encodeURIComponent(ID) +
        "&tbm=isch&q=" +
        encodeURIComponent(place);
    request({ url: url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to connect to location server(zenserp)", undefined);
        } else if (body.error) {
            callback(body.error, undefined);
        } else if (body.image_results.length === 0) {
            callback("Unable to find image for entered place", undefined);
        } else {
            callback(undefined, {
                fullImg: body.image_results[0].sourceUrl,
                source: body.image_results[0].source
            });
        }
    });
};

module.exports = zenserpIMG;
