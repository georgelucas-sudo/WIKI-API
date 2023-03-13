//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect("mongodb://localhost:27017/wikiDB")
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("ERROR:", err.message);
    });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", async(req, res) => {
    try {
        const articles = await Article.find({});
        res.send(articles);
    } catch (err) {
        res.send(err);
    }
});

app.post("/articles", async(req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
    });
    try {
        const savedArticle = await article.save();
        res.send(savedArticle);

    } catch (err) {
        res.send(err);
    }
});

app.delete("/articles", async(req, res) => {
    await Article.deleteMany(function(err) {
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

// Article.find({}).then((articles) => { // find all articles in the database and return them as an array

//     console.log(articles);
// }).catch((err) => {
//     console.log(err);

app.post("/articles", function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});