const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('notes:mongodb-model');
const error = require('debug')('notes:error');
const Book = require('./Book');
const util = require('util')

var db;
var dbUrl = 'mongodb://localhost:27017'

exports.connectDB = function () {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        // Connection URL
        var url = dbUrl;
        // Use connect method to connect to the Server
        MongoClient.connect(url, (err, client) => {
            if (err) return reject(err);
            db = client.db('nytbestseller')
            resolve(db);
        });
    });
};


exports.create = function (book) {
    return exports.connectDB()
    .then(dbo => {
        let collection = dbo.collection('books');
        return collection.insertOne(book).then(doc => {
            
            
            debug("1 book inserted");
            return book
        }).catch(err => {
            error("error on create")
            error(err)
            next(err)
        })
    })
}

exports.readAllByRank = function () {
    return exports.connectDB()
    .then(db =>{
        let collection = db.collection('books')
        let books = []
        let cursor = collection.find({}).addQueryModifier('$orderby', {rank: 1})
        
        return cursor.toArray().then(bookDocs =>{
            debug(JSON.stringify(bookDocs))
        
            bookDocs.forEach(bookDoc => {
                let newBook = new Book(bookDoc.title, bookDoc.author, bookDoc.rank, bookDoc.weeksOnList)
                debug(newBook)
                books.push(newBook)
            });

            debug(books)
            return books
        })
    })    
}

exports.deleteAll = function () {
    return exports.connectDB()
        .then(db => {
            let collection = db.collection('books')
            return collection.deleteMany({})
        })
}