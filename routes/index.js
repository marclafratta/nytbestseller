var express = require('express');
var router = express.Router();
var request = require('request-promise');
var Book = require('../models/Book');
var bookMongo = require('../models/book-mongodb');

const debug = require('debug')('nytbestseller:router-index');
const error = require('debug')('nytbestseller:error');


router.get('/fromDB', function (req, res, next) {

  debug("reading from db")

  bookMongo.readAllByRank().then(books =>{
    if (books === undefined){
      books = []
    }

    res.render('index', {books: books })
  })
});


router.get('/fromAPI', function (req, res, next) {

  debug("reading from api, storing in db")

  let options = {
    uri: 'http://api.nytimes.com/svc/books/v3/lists/2018-01-07/combined-print-and-e-book-fiction.json?api-key=aa4f31a56f6749c18447e2c89180f42a',
    json: true
  };

  
  bookMongo.deleteAll().then(function(){
  request(options).then(function (response) {

    let books = []
    
    let top10Books = response.results.books.filter(function (book, index) {
      return index < 10
    })

    top10Books.forEach(book => {
      let bookObj = new Book(book.title, book.author, book.rank, book.weeks_on_list)
      debug(bookObj.JSON)
      books.push(bookObj)
    });

    return books
  
    }).then(function (books) {
      createPromises = []
      
      books.forEach(function (book) {
        debug(book)
        createPromises.push(bookMongo.create(book))
      })

      return Promise.all(createPromises)
    }).then(function (books) {
      //books = []
      res.render('index', {books: books })
    })
  })
});


module.exports = router;
