import User from '../models/users.js'
import Article from '../models/articles.js';
import async from 'async';
import { body, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const index = async function(req, res, next) {
    try { let isLoggedIn = false;
        if (res.locals.currentUser) { isLoggedIn = true };

        const results = await User.find({}, 'profileName admin profileDesc profilePic themePref layoutPref blogTitle dateJoined articles')
        .populate('articles');

        res.json({
          users: results, 
          isLoggedIn: isLoggedIn 
        });

    } catch(err) { return next(err) }
};

const login_post = function (req, res) {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Incorrect Username or Password",
        user,
      });
    }

    jwt.sign({ _id: user._id, username: user.profileName }, process.env.secretkey, { expiresIn: '15m' }, (err, token) => {
      if (err) return res.status(400).json(err);
      
      res.json({
          token,
          user: { _id: user._id, username: user.profileName }
      });
    })
  }) (req, res);
};

const register_post = [
  // Validate fields
  body('profileName').trim().isLength({min: 4}).escape().withMessage('At minimum, your username must be 4 characters long'),
  body('password').trim().isLength({min: 5}).escape().withMessage('At minimum, your password must be 5 characters long'),
  body('confirmPassword').trim().isLength({min: 5}).escape().withMessage('At minimum, your password must be 5 characters long')
  .custom( async(value, {req }) => {
    if(value !== req.body.password) {
        throw new Error('Passwords do not match')
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.errors })
    }

    try {
      const userExists = await User.findOne({profileName: req.body.profileName});

      if (userExists !== null) {
         return res.json({ userExists: true })
      }
        bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {

        const user = new User({
          profileName: req.body.profileName,
          password: hashedPassword,
          admin: false,
          profileDesc: req.body.profileDesc,
          themePref: req.body.themePref,
          layoutPref: req.body.layoutPref,
          blogTitle: req.body.blogTitle,
        })

        user.save(err => {
          if (err) { return next(err) }
          res.json({
            message: 'registration successful'
          })
        })
      })
    } catch(err) { 
      return next(err) 
    }
  }
];

const user_update = function(req, res, next) {
  jwt.verify(req.token, process.env.secretkey, async (err, authData) => {
    if (err) { 
      res.json({ message: "login validation check failed" })
    } else {
      const userToUpdate = await User.findOne({_id: res.locals.currentUser._id})
      userToUpdate.save(err =>{
        if (err) { return next(err) }
        res.json({ 
          message: "update successful", 
          authData 
        })
      });
    };
  });
}

const user_delete = function(req, res, next) {
  jwt.verify(req.token, process.env.secretkey, async (err, authData) => {
    if (err) {
      res.json({ message: "login validation check failed" })
    } else {
      User.findByIdAndDelete(req.body.userId, function(err, docs){
        if (err) { return next(err) }
        res.json({
          message: "user deleted",
          authData
        })
      });
    };
  });
}

export default { index, login_post, register_post, user_update, user_delete }
