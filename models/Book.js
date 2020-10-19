const mongoose = require("mongoose");

const schema = mongoose.Schema;

const bookSchema = new schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  commentcount: { type: Number, required: true },
  comments: [{ type: String }],
});

const Book = mongoose.model("book", issueSchema);

module.exports = Book;
