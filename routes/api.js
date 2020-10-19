/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

const Book = require("../models/Book");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
        if (err) {
          console.error(err);
        } else {
          // res.json(books);
          let result = [];
          books.forEach((book) => {
            const { _id, title, commentcount } = book;
            const eachBook = { _id, title, commentcount };
            result.push(eachBook);
          });
          res.json(result);
        }
      });
    })

    .post(function (req, res) {
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title) {
        Book.find({ title })
          .then((book) => {
            if (book[0]) {
              res.json("title already exists");
            } else {
              const book = new Book({
                _id: new ObjectId(),
                title,
                commentcount: 0,
              });

              book.save((err, book) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`Added book with id: ${book._id} to db.`);
                  res.json(book);
                }
              });
            }
          })
          .catch((err) => {
            console.error(err);
            res.json("error");
          });
      } else {
        res.json("error: no title/ bookid");
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("deleted all books from db");
          res.json("complete delete successful");
        }
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, book) => {
        if (err) {
          console.error(err);
        } else {
          const { _id, title, comments } = book;
          res.json({ _id, title, comments });
        }
      });
    })

    .post(function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get

      Book.findById(bookid)
        .then((book) => {
          if (book) {
            let comments = book.comments;
            comments.push(comment);
            const commentcount = comments.length;
            const update = { comments, commentcount };
            Book.findByIdAndUpdate(
              bookid,
              update,
              { new: true, omitUndefined: true },
              (err, book) => {
                if (err) {
                  console.error(err);
                  res.json(`could not update ${_id}`);
                } else {
                  const { _id, title, comments } = book;
                  res.json({ _id, title, comments });
                }
              }
            );
          } else {
            res.json("no book with this id in database");
          }
        })
        .catch((err) => {
          console.error(err);
          res.json("no book with this id in database");
        });
    })

    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findById(bookid)
        .then((book) => {
          if (book) {
            Book.findByIdAndRemove(bookid, (err) => {
              if (err) {
                console.error(err);
                res.json("could not delete this book from database");
              } else {
                res.json("delete successful");
              }
            });
          } else {
            res.json("no book with this id in database");
          }
        })
        .catch((err) => {
          console.error(err);
          res.json("no book with this id in database");
        });
    });
};
