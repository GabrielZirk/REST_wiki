const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const read = require("body-parser/lib/read");

const nodePORT = "3000";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const wikiScheme = new mongoose.Schema({
    title: String,
    title_lower: String,
    content: String
});

const Article = mongoose.model("Article", wikiScheme);

//Routes

app.route("/articles") // Chaining route handlers (reduces typos)
    .get((req, res) => {
        Article.find({}, (err, docs) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(docs);
            };
        });
    })

    .post((req, res) => {  // In REST architecture, the post request should go to the same as the get request.

        const post = new Article({
            title: req.body.title,
            title_lower: _.lowerCase(req.body.title),
            content: req.body.content
        });
        post.save((err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Successfully added a new article.");
            };
        });
    })

    .delete((req, res) => { // Deletes all documents in the collection
        Article.deleteMany({}, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Successfully deleted all articles.");
            }
        });
    });

app.route("/articles/:article")
    .get((req, res) => {

        Article.findOne({ title_lower: _.toLower(req.params.article) }, (err, doc) => {
            if (err) {
                console.log(err);
            }
            else if (doc) {
                res.send(doc)
            }
            else {
                res.send("No article found.");
            };
        })
    })

    .put((req, res) => {
        Article.replaceOne(
            {
                title_lower: _.toLower(req.params.article)
            },
            {
                title: req.body.title,
                title_lower: _.toLower(req.body.title),
                content: req.body.content
            },
            (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send("Successfully updated articles.");
                }
            })
    })

    .patch((req, res) => {
        Article.updateOne(
            {
                title_lower: _.toLower(req.params.article)
            },
            {
                title: req.body.title,
                title_lower: _.toLower(req.body.title),
                content: req.body.content
            }, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send("Sucessfully updated.");
                }
            })
    })
    
    .delete((req, res) => {
        Article.deleteOne({title_lower: _.toLower(req.params.article)},
        (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Sucessfulle deleted article.");
            }
        })
    })



app.listen(nodePORT, () => {
    console.log("Server is running on port " + nodePORT);
});