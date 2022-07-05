import User from '../models/users'
import Article from '../models/articles';
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

export default { index }
