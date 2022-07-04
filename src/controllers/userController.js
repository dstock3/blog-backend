import User from '../models/users'
import Article from '../models/articles';
import async from 'async';

const index = function(req, res, next) {
    User.find({}, 'profileName admin profileDesc profilePic themePref layoutPref blogTitle dateJoined articles')
    .populate('profileDesc')
    .populate('admin')
    .populate('profilePic')
    .populate('themePref')
    .populate('layoutPref')
    .populate('blogTitle')
    .populate('dateJoined')
    .populate('articles')
    .exec(function(err, results) {
        if (err) { return next(err); }
        res.send({users: results});
    });
};

export default { index }
