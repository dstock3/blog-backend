import User from '../models/users.js'
import Article from '../models/articles.js';
import async from 'async';
import { body, validationResult } from "express-validator";

const index = async function(req, res, next) {
    try { let isLoggedIn = false;
        if (res.locals.currentUser) { isLoggedIn = true };

        const results = await User.find({}, 'profileName admin profileDesc profilePic themePref layoutPref blogTitle dateJoined articles')
        .populate('articles');

        res.send({users: results, isLoggedIn: isLoggedIn });

    } catch(err) { return next(err) }
};

const login_post = function(req, res, next) {
    console.log("login post")
}

const register_post = function(req, res, next) {
    console.log("register post")
}

const user_update = async function(req, res, next) {
    const userToUpdate = await User.findOne({_id: res.locals.currentUser._id})

    userToUpdate.save(err =>{
      if (err) { return next(err) }
      res.send("update successful")
    })
}

const user_delete = function(req, res, next) {
    console.log("user delete")
}


export default { index, login_post, register_post, user_update, user_delete }
