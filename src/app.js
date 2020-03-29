console.log("Client Srcipt loaded");
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast.js");
const geocode = require("./utils/geocode.js");
const unsplash = require("./utils/unsplash.js");

const app = express();
const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));

app.set("view engine", "hbs");
app.set("views", viewsPath);

hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
    res.render("index", {
        name: "Kevin Tony",
        title: "Weather"
    });
});
app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "No address was passed !"
        });
    }
    geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, { summary, temperature, precipProbability } = {}) => {
            if (error) {
                return res.send({ error });
            }
            unsplash(location, (error, { fullImg, thumbImg, smallImg } = {}) => {
                if (error) {
                    return res.send({
                        imgError: error,
                        summary: summary,
                        temperature: temperature,
                        precipProbability: precipProbability,
                        location: location
                    });
                }
                res.send({
                    smallImg: smallImg,
                    summary: summary,
                    temperature: temperature,
                    precipProbability: precipProbability,
                    location: location
                });
            });
        });
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        name: "Kevin Tony",
        title: "Help",
        helpText: "Contact kevtrc@gmail.com"
    });
});
app.get("/about", (req, res) => {
    res.render("about", {
        name: "Kevin Tony",
        title: "About Me"
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        name: "Kevin Tony",
        title: "404 Help",
        errorMessage: "Help article not found"
    });
});
app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Kevin Tony",
        errorMessage: "Page not found"
    });
});

app.listen(port, () => {
    console.log("server up and running");
});
