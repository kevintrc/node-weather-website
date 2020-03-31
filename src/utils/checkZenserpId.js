const request = require("request");
const fs = require("fs");
const path = require("path");

const checkZenserpId = (ID, callback) => {
    const url = "https://app.zenserp.com/api/v2/status?apikey=" + encodeURIComponent(ID);
    request({ url: url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to validate ID(zenserp)", undefined);
        } else if (body.error) {
            console.log("Out of tokens");
            fs.renameSync(
                path.join(__dirname, "../../templates/views/index.hbs"),
                path.join(__dirname, "../../templates/views/tempIndex.hbs")
            );
            fs.renameSync(
                path.join(__dirname, "../../templates/views/404ServerDown.hbs"),
                path.join(__dirname, "../../templates/views/index.hbs")
            );

            callback(undefined, {
                remaining_requests: undefined
            });
        } else {
            callback(undefined, {
                remaining_requests: body.remaining_requests
            });
        }
    });
};

module.exports = checkZenserpId;
