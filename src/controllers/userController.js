import User from '../models/users.js'
import Article from '../models/articles.js';
import async from 'async';
import { body, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Verify Token
export function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  
  if(typeof bearerHeader !== 'undefined') {
      req.token = bearerHeader.split(' ')[1];
      next();
  } else {
      res.sendStatus(403)
  }
}

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

const login_post = [

  //need to auth user in login post

  async (req, res, next) => {
    jwt.sign({user}, process.env.secretkey, { expiresIn: '30s'}, (err, token) => {
      res.json({
          token
      });
    })
  }
] 

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
    if(err) { 
      res.json({ message: "login validation failed" })
    } else {
      const userToUpdate = await User.findOne({_id: res.locals.currentUser._id})
      userToUpdate.save(err =>{
        if (err) { return next(err) }
        res.json({ message: "update successful", authData })
      });
    };
  });
}

const user_delete = function(req, res, next) {
    console.log("user delete")
}


export default { index, login_post, register_post, user_update, user_delete }
