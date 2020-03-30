const request = require("request");

const checkZenserpId = (ID, callback) => {
    const url = "https://app.zenserp.com/api/v2/status?apikey=" + encodeURIComponent(ID);
    request({ url: url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback("Unable to validate ID(zenserp)", undefined);
        } else {
            callback(undefined, {
                remaining_requests: body.remaining_requests
            });
        }
    });
};

module.exports = checkZenserpId;
