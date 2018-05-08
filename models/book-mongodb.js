const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('notes:mongodb-model');
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
            
            
            console.log("1 book inserted");
            return book
        }).catch(err => {
            console.log("error on create")
            console.log(err)
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
            console.log(JSON.stringify(bookDocs))
        
            bookDocs.forEach(bookDoc => {
                let newBook = new Book(bookDoc.title, bookDoc.author, bookDoc.rank, bookDoc.weeksOnList)
                console.log(newBook)
                books.push(newBook)
            });

            console.log(books)
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