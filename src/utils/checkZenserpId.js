const request = require("request");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

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
            var transporter = nodemailer.createTransport({
                service: "gmail",
                tls: { rejectUnauthorized: false },
                auth: {
                    user: "kevinweatherapp@gmail.com",
                    pass: "chavara15"
                }
            });
            var mailOptions = {
                from: "kevinweatherapp@gmail.com",
                to: "kevtrc15@gmail.com",
                subject: "Weather app has run out of requests",
                text: "Go add requests https://app.zenserp.com/register, also update index.hbs"
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log("error : " + error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

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
