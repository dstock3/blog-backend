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

const createArticle = (title, img, imgDesc, date, content, comments) => {
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

const createUser = (profileName, admin, profileDesc, profilePic, themePref, layoutPref, blogTitle, dateJoined, articles) => {
    let user = new User(profileName, admin, profileDesc, profilePic, themePref, layoutPref, blogTitle, dateJoined, articles);

    user.save(function (err) {
        if (err) { cb(err, null)
          return
        }
        console.log('New Article: ' + user);
        users.push(user)
        cb(null, user)
    });
}

function createArticles(cb) {
    async.series([
        function(callback) {
            createArticle(

            )
        },


    ])
}

function createUsers(cb) {
    async.series([
        function(callback) {
            createUser(
                "username",
                false,
                "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur",
                "http://via.placeholder.com/105x105",
                "azure",
                "basic",
                "Tempora Incidunt",
                "1/11/21",
                [articles[0], articles[1], articles[2], articles[3], articles[4]]
            )},
        function(callback) {
            createUser(
                "username2",
                false,
                "Vestibulum sed arcu non odio euismod lacinia at quis risus",
                "http://via.placeholder.com/105x105",
                "dark",
                "basic",
                "My Other Blog",
                "1/05/22",
                [articles[5], articles[6], articles[7], articles[8], articles[9]]
            )},
        function(callback) {
            createUser(
                "username3",
                false,
                "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit",
                "http://via.placeholder.com/105x105",
                "light",
                "basic",
                "The Newest Blog",
                "1/07/22",
                [articles[10], articles[11], articles[12], articles[13], articles[14]]
            )},
    ], cb)
}

async.series([
    createArticles,
    createUsers
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Users: ' + users);
        console.log('Articles: ' + articles);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
  

