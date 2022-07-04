#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
import async from 'async'
import Article from './models/articles'
import User from './models/users'

import mongoose from 'mongoose';
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const articles = []
const users = []

const createArticles = (title, img, imgDesc, date, content, comments) => {
    let article = new Article(title, img, imgDesc, date, content, comments);

    article.save(function (err) {
        if (err) { cb(err, null)
          return
        }
        console.log('New Article: ' + article);
        articles.push(article)
        cb(null, article)
    });

}

const createUsers = (profileName, password, admin, profileDesc, profilePic, themePref, layoutPref, blogTitle, dateJoined, articles) => {
    let username = new User(userDetail);

}



