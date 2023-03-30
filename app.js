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

app.route("/articles") //refactored the code by using chain method


.get(async(req, res) => {
        try {
            const articles = await Article.find({});
            res.send(articles);
        } catch (err) {
            res.send(err);
        }
    })
    .post(async(req, res) => {
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
    })
    .delete(async(req, res) => {
        await Article.deleteMany(function(err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    })

// Article.find({}).then((articles) => { // find all articles in the database and return them as an array

//     console.log(articles);
// }).catch((err) => {
//     console.log(err);

app.post("/articles", function(req, res) {
    console.log();
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if (!err) {
            res.send("successfully added new article")

        } else {
            res.send(err)
        }



    });
});
//////////////////////////
// use the async await method to get the data from the database of a specific article








app.route("/articles/:articleTitle")
    .get(async function(req, res) {
        try {
            const foundArticle = await Article.findOne({ title: req.params.articleTitle });
            res.send(foundArticle);
        } catch (err) {
            res.send(err);

        }

    })

//.put chained route

.put(async function(req, res) {
    try {
        const updatedArticle = await Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content })
            // res.send(updatedArticle);
        res.send("successfully updated")

    } catch (err) {


        res.send(err);
    };
})

.patch(async function(req, res) {
        try {
            await Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
                // res.send(updatedArticle);
            res.send("successfully updated")

        } catch (err) {
            res.send(err);

        };
    })
    .delete(async function(req, res) {

        try {
            await Article.deleteOne({ title: req.params.articleTitle })
            res.send("successfully deleted")

        } catch (err) {

            res.send(err)
        };
    });



app.listen(3000, function() {
    console.log("Server started on port 3000");
});