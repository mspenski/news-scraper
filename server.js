//Using this template, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save information from the page in a result array, and log it to the console.

var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");

var app = express();
app.use(express.static("public"));
var PORT = process.env.PORT || 3000;

// Database configuration
var databaseUrl = "ecuArticles";
var collections = ["articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
// app.get("/", function (req, res) {
//   res.send("Hello world");
// });

// Make a request via axios to grab the HTML body from the site of your choice
app.get("/scrape", function (req, res) {

  axios
    .get("https://old.reddit.com/r/ECU/")
    .then(function (response) {
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);

      // An empty array to save the data that we'll scrape
      var results = [];

      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("div.top-matter").each(function (i, element) {
        var title = $(element)
          .find("a.title")
          .text();
        var url = $(element)
          .find("a")
          .attr("href");
        var submitted = $(element)
          .find("p.tagline")
          .text();

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title: title,
          url: url,
          submitted: submitted,
        });
      });

      // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
      // db.articles.insert(results);
    })
});


// route 1
app.get("/all", function (req, res) {
  db.articles.find({}, function (err, found) {
    if (err) {
      console.log(err)
    } else {
      res.json(found)
    }
  });
});

app.listen(PORT, function () {
  console.log("App running on port 3000!");
});