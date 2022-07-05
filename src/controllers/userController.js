import User from '../models/users.js'
import Article from '../models/articles.js';
import async from 'async';
import { body, validationResult } from "express-validator";

const index = function(req, res, next) {
    User.find({}, 'profileName admin profileDesc profilePic themePref layoutPref blogTitle dateJoined articles')
    .populate('articles')
    .exec(function(err, results) {
        if (err) { return next(err); }
        res.send({users: results});
    });
};

const login_post = function(req, res, next) {
    console.log("login post")
}

const register_post = function(req, res, next) {
    console.log("register post")
}

const user_update = function(req, res, next) {
    console.log("user update")
}

const user_delete = function(req, res, next) {
    console.log("user delete")
}


export default { index, login_post, register_post, user_update, user_delete }
