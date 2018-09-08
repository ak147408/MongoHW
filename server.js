//require packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
//port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

var router = express.Router();

app.use(express.static(_dirname + "/public"));


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

app.use(router);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongohw");

// Routes


app.get("/scrape", function (req, res) {
    //request body of HTML
    axios.get("https://www.cnn.com/").then(function (response) {
        //load to cheerio and set as $ for later
        var $ = cheerio.load(response.data);

        //grab the h2 tag headers on the site
        $("article h2").each(function (i, element) {
            // empty var that will later populate articles
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // creates a new article after the scrape
            db.Article.create(result)
                .then(function (dbArticle) {
                    // see the article in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // handles error
                    return res.json(err);
                });
        });

        // if we were successful
        res.send("Scrape Complete");
    });
});

// route for articles from db
app.get("/articles", function (req, res) {
    // grab all articles from collection
    db.Article.find({})
        .then(function (dbArticle) {
            // sends articles to the page
            res.json(dbArticle);
        })
        .catch(function (err) {
            //handle error
            res.json(err);
        });
});

// route to grab article by ID
app.get("/articles/:id", function (req, res) {
    // finds matches in db
    db.Article.findOne({ _id: req.params.id })
        // populate all notes associated 
        .populate("note")
        .then(function (dbArticle) {
            // If sucessful
            res.json(dbArticle);
        })
        .catch(function (err) {
            // sends error
            res.json(err);
        });
});

// for saving and updating
app.post("/articles/:id", function (req, res) {
    // Create new note
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});
// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});




















app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
