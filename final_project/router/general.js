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
public_users.get('/', async function(req, res) {
    const fetchBooks = () => {
        return new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject("Books data not found");
            }
        });
    };

    try {
        const booksData = await fetchBooks();
        res.send(JSON.stringify(booksData, null, 4));
    } catch (error) {
        res.status(500).send({message: error});
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function(req, res) {
    const fetchBookByIsbn = (isbn) => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });
    };

    try {
        const isbn = req.params.isbn;
        const book = await fetchBookByIsbn(isbn);
        res.send(book);
    } catch (error) {
        res.status(404).send({"message": error});
    }
});

  
// Get book details based on author
public_users.get('/author/:author', async function(req, res) {
    const fetchBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
            const results = Object.values(books).filter(book => book.author === author);
            if (results.length > 0) {
                resolve(results);
            } else {
                reject("No books found for the given author");
            }
        });
    };

    try {
        const author = req.params.author;
        const results = await fetchBooksByAuthor(author);
        res.send(results);
    } catch (error) {
        res.status(404).send({message: error});
    }
});


// Get all books based on title
public_users.get('/title/:title', async function(req, res) {
    const fetchBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
            const results = Object.values(books).filter(book => book.title === title);
            if (results.length > 0) {
                resolve(results);
            } else {
                reject("No books found for the given title");
            }
        });
    };

    try {
        const title = req.params.title;
        const results = await fetchBooksByTitle(title);
        res.send(results);
    } catch (error) {
        res.status(404).send({message: error});
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
