const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return !users.some(user.username === username);
}

const authenticatedUser = (username,password)=>{
    return !users.some((user) => {user.username === username && user.password === password});
}
regd_users.use(express.json());

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      res.status(404).json({message: "Error logging in"});
      return;
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    res.status(200).send("User successfully logged in");
    return;
  } else {
        res.status(208).json({message: "Invalid Login. Check username and password"});
        return
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params;
    const { newReview } = req.body;
    if (!req.session.authorization) {
        res.status(401).json({"message": "user not authorised"})
    } else {
        username = req.session.authorization.username;
        book = books[isbn];
        reviews = book.review;
        reviews[username] = newReview;
        res.send({"message": "Review for book with ISBN " + isbn + " added/updated"})
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params;
    if (!req.session.authorization) {
        res.status(401).json({"message": "user not authorised"})
    } else {
        username = req.session.authorization.username;
        book = books[isbn];
        review = book.review;
        delete review[username];
        res.json({"message": "the review for the book with ISBN " + isbn + " posted by the user " + username + " has been deleted"})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
