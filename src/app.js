const path = require("path");
const fs = require("fs");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast.js");
const geocode = require("./utils/geocode.js");
const zenserpIMG = require("./utils/zenserpIMG.js");
const checkZenserpId = require("./utils/checkZenserpId.js");

const app = express();
const port = process.env.PORT || 3000;

//deployment paths
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
      title: "Weather",
   });
});

try {
   var zenserpIds = fs.readFileSync(__dirname + "/zenserpIds.JSON");
} catch (err) {
   console.log("Error : Couldn't load zenserIds.JSON");
}
zenserpIds = JSON.parse(zenserpIds);

app.get("/suggest", (req, res) => {
   if (!req.query.address) {
      return res.send({
         error: "No address was passed !",
      });
   }
   geocode(req.query.address, (error, { suggestions } = {}) => {
      if (error) {
         return res.send({ error });
      }
      res.send({ suggestions });
   });
});

app.get("/suggestweather", (req, res) => {
   forecast(
      req.query.latitude,
      req.query.longitude,
      (
         error,
         { summary, temperature, precipProbability, windSpeed, humidity, pressure, icon } = {}
      ) => {
         if (error) {
            return res.send({ error });
         }
         var i = 0;
         zenserpIMG(req.query.location, zenserpIds[i], (imgError, { images, source } = {}) => {
            console.log("location : " + req.query.location);
            if (imgError) {
               res.send({
                  imgError,
                  summary,
                  temperature,
                  precipProbability,
                  location: req.query.location,
                  windSpeed,
                  icon,
                  humidity,
                  pressure,
               });
            } else {
               res.send({
                  images,
                  source,
                  summary,
                  temperature,
                  precipProbability,
                  location: req.query.location,
                  windSpeed,
                  humidity,
                  icon,
                  pressure,
               });
            }
            checkZenserpId(zenserpIds[i], (error, { remaining_requests } = {}) => {
               if (error) return console.log("Please check zenserp token validity manually");
               if (!remaining_requests || remaining_requests == 1) {
                  console.log("Remaining request : " + remaining_requests + " so switching");
                  zenserpIds = [...zenserpIds.slice(1, zenserpIds.length), zenserpIds[0]];
                  fs.writeFile(
                     __dirname + "/zenserpIds.JSON",
                     JSON.stringify(zenserpIds),
                     (err) => {
                        if (err) return console.log(err);
                     }
                  );
               } else {
                  console.log("Remaining request : " + remaining_requests + " so not switching");
               }
            });
         });
      }
   );
});

app.get("/weather", (req, res) => {
   if (!req.query.address) {
      return res.send({
         error: "No address was passed !",
      });
   }
   geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
      if (error) {
         return res.send({ error });
      }
      forecast(
         latitude,
         longitude,
         (
            error,
            { summary, temperature, precipProbability, windSpeed, humidity, pressure, icon } = {}
         ) => {
            if (error) {
               return res.send({ error });
            }
            var i = 0;
            zenserpIMG(location, zenserpIds[i], (imgError, { images, source } = {}) => {
               console.log("location : " + location);
               if (imgError) {
                  res.send({
                     imgError,
                     summary,
                     temperature,
                     precipProbability,
                     location,
                     windSpeed,
                     icon,
                     humidity,
                     pressure,
                  });
               } else {
                  res.send({
                     images,
                     source,
                     summary,
                     temperature,
                     precipProbability,
                     location,
                     windSpeed,
                     humidity,
                     icon,
                     pressure,
                  });
               }
               checkZenserpId(zenserpIds[i], (error, { remaining_requests } = {}) => {
                  if (error) return console.log("Please check zenserp token validity manually");
                  if (!remaining_requests || remaining_requests == 1) {
                     console.log("Remaining request : " + remaining_requests + " so switching");
                     zenserpIds = [...zenserpIds.slice(1, zenserpIds.length), zenserpIds[0]];
                     fs.writeFile(
                        __dirname + "/zenserpIds.JSON",
                        JSON.stringify(zenserpIds),
                        (err) => {
                           if (err) return console.log(err);
                        }
                     );
                  } else {
                     console.log("Remaining request : " + remaining_requests + " so not switching");
                  }
               });
            });
         }
      );
   });
});

app.get("/help", (req, res) => {
   res.render("help", {
      name: "Kevin Tony",
      title: "Help",
      helpText: "Contact kevtrc@gmail.com",
   });
});
app.get("/about", (req, res) => {
   res.render("about", {
      name: "Kevin Tony",
      title: "About Me",
   });
});

app.get("*", (req, res) => {
   res.render("404", {
      title: "404",
      name: "Kevin Tony",
      errorMessage: "Page not found",
   });
});

app.listen(port, () => {
   console.log("server up and running on " + port);
});
