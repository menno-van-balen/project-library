/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { request } = require("chai");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    let id1;
    const title1 = "From Zero to Hero";
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: title1,
            })
            .end((err, res) => {
              id1 = res.body._id;

              assert.equal(res.status, 200);
              assert.property(res.body, "_id");
              assert.equal(res.body.title, title1);
              assert.equal(res.body.commentcount, 0);
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body, "error: no title/ bookid");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[res.body.length - 1],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[res.body.length - 1],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[res.body.length - 1],
              "_id",
              "Books in array should contain _id"
            );
            assert.equal(
              res.body[res.body.length - 1]._id,
              id1,
              "the id should be the _id of the first stored book"
            );
            assert.equal(
              res.body[res.body.length - 1].title,
              title1,
              "the title should be the title of the last stored book"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${"12e123"}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, "error: bookid not in database");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${id1}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id1);
            assert.equal(res.body.title, title1);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post(`/api/books/${id1}`)
            .send({ comment: "probably a book about coding..." })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(
                res.body.comments[0],
                "probably a book about coding..."
              );
              done();
            });
        });
      }
    );

    suite(
      "DELETE /api/books/[id] => delete a book object with id",
      function () {
        test("Test DELETE /api/books/[id]", function (done) {
          chai
            .request(server)
            .delete(`/api/books/${id1}`)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body, "delete successful");
              done();
            });
        });
      }
    );
  });
});
