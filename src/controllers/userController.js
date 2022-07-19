import User from '../models/users.js'
import async from 'async';
import { body, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const index = async function(req, res, next) {
  try {
    const results = await User.find({}, 'profileName admin profileDesc profilePic themePref layoutPref blogTitle dateJoined articles')
    .populate('articles');

    const webToken = req.header('login-token');

    if (!webToken) {
      res.status(200).json({
        users: results
      });
    } else {
      const verified = jwt.verify(webToken, process.env.secretkey);
      res.user = verified;

      res.status(200).json({
        users: results,
        user: req.user
      });
    }
  } catch(err) { return next(err) }
};

const login_post = async function (req, res) {
  const user = await User.findOne({ profileName: req.body.username })
  if(!user) return res.status(400).json({ message: "This username does not exist." });

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) return res.status(401).send({ message: "Your login credentials are incorrect." });

  const webToken = jwt.sign({ _id: user.id}, process.env.secretkey, { expiresIn: '15m'} );
  res.header('login-token', webToken).send(webToken)
};

const logout_post = async function (req, res) {

}

const register_post = [
  // Validate fields
  body('profileName', 'Your username must be at least four characters long.')
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body('password', 'Your password must be at least five characters long.')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('confirmPassword', 'Your password must be at least five characters long.')
    .trim()
    .isLength({ min: 5 })
    .escape()
    .custom(
      async (value, {req }) => {
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

const user_update = async function(req, res, next) {
  if (err) { 
    res.json({ message: "login validation check failed" })
  } else {
    const userToUpdate = await User.findOne({_id: res.locals.currentUser._id})
    userToUpdate.save(err =>{
      if (err) { return next(err) }
      res.json({ 
        message: "update successful", 
        user: req.user 
      })
    });
  };

}

const user_delete = function(req, res, next) {
  if (err) {
    res.json({ message: "login validation check failed" })
  } else {
    User.findByIdAndDelete(req.body.userId, function(err, docs){
      if (err) { return next(err) }
      res.json({
        message: "user deleted",
        user: req.user
      })
    });
  };
}

export default { index, login_post, logout_post, register_post, user_update, user_delete }
