const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password ) {
      if (users[username]) {
        res.status(400).send({message: "User already exists"});
      } else {
        users[username] = { password };
        res.send({message: "User registered successfully"});
      }
    } else {
      res.status(400).send({message: "Invalid user data"});
    }
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn])
  }
  else {
    res.status(404).send({"message": "Book not found"})
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const results = Object.values(books).filter(book => book.author === author);
  if (results.length>0) {
    res.send(results)
  } else {
    res.status(404).send({message: "No books found for the given author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const results = Object.values(books).filter(book => book.title === title);
  if (results.length>0) {
    res.send(results)
  } else {
    res.status(404).send({message: "No books found for the given title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      res.send(books[isbn].reviews)
    }
    else {
      res.status(404).send({"message": "Reviews not found for the specified books"})
    }
});

module.exports.general = public_users;
