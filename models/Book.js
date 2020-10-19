const mongoose = require("mongoose");

const schema = mongoose.Schema;

const bookSchema = new schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  commentcount: { type: Number, required: true },
  comments: [],
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
