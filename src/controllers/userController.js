import User from '../models/users.js'
import Comment from '../models/comments.js';
import async from 'async';
import { body, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateImage } from '../img/multer.js'
import { parseJwt } from '../auth/parseToken.js'
import { uploadMiddleware } from '../img/multer.js'

const index = async function(req, res, next) {
  try {
    const results = await User.find({}, 'profileName admin profileDesc profilePic themePref layoutPref blogTitle dateJoined articles')
    .populate('articles');

    const loginToken = req.header('login-token');

    let verified
    if (loginToken) {
      verified = jwt.verify(loginToken, process.env.secretkey);
    } else {
      verified = false
    };

    if (verified) {
      res.user = verified;
      res.status(200).json({
        users: results,
        user: res.user
      });
    } else {
      res.status(200).json({
        users: results
      });
    };
  } catch(err) { return next(err) }
};

const login_post = async function (req, res) {
  const user = await User.findOne({ profileName: req.body.username })
  if(!user) return res.status(400).json({ message: "This username does not exist." });

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) return res.status(401).send({ message: "Your login credentials are incorrect." });

  const webToken = jwt.sign({ _id: user.id}, process.env.secretkey, { expiresIn: '60m'} );
  res.header('login-token', webToken).send(webToken)
};

const user_read_get = async function(req, res) {
  User.find({ 'profileName': req.params.username }, 'profileName profileDesc profilePic blogTitle dateJoined themePref layoutPref articles')
    .populate('articles')
    .exec(function(err, thisUser) {
      if (err) { return next(err) }
      res.json({ user: thisUser })
    });
}

const user_create_post = [
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
    try {
      await uploadMiddleware(req, res);
    } catch(err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
    next()
  },

  async (req, res, next) => {
    const errors = validationResult(req)
    console.log(req.file)

    let imgMessages
    let imgFilename

    if (req.file) { 
      imgMessages = validateImage(req.file)
      imgFilename = req.file.originalname
    }

    if (!errors.isEmpty() || (imgMessages)) {
      return res.json({ errors: errors.errors, imgErrors: imgMessages })
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
          profilePic: imgFilename
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

const user_update_put = [
  // Validate fields
  body('profileName', 'Your username must be at least four characters long.')
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body('password', 'Your password must be at least five characters long.')
    .trim()
    .isLength({ min: 5 })
    .escape(),

    async (req, res, next) => {
      const token = req.header('login-token');
      const parsedToken = parseJwt(token);

      const errors = validationResult(req)
      
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.errors })
      }

      bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
        const updatedUser = {
          profileName: req.body.profileName,
          password: hashedPassword,
          admin: false,
          profileDesc: req.body.profileDesc,
          themePref: req.body.themePref,
          layoutPref: req.body.layoutPref,
          blogTitle: req.body.blogTitle,
        }

        User.find({"profileName": req.params.username})
          .exec(function(err, thisUser) {
            if (thisUser[0]._id.toString() === parsedToken._id) {
              User.findByIdAndUpdate(parsedToken._id, updatedUser, {}, function (err, updatedUser) {
                if (err) { return next(err) }
                res.json({ 
                  message: "update successful"
                });
              });
            } else {
              res.json({ message: "authentication error" });
            }
          });
      });
    }
]

const user_delete = function(req, res, next) {
  const token = req.header('login-token');
  const parsedToken = parseJwt(token)

  User.findByIdAndDelete(parsedToken._id, function(err, thisUser) {
    if (err) { return next(err) }
    res.json({
      message: `user deleted`
    });
  });
}

const comment_read_get = function(req, res) {
  User.find({ 'profileName': req.params.username })
    .exec(function(err, thisUser) {
      if (err) { return next(err) }
      Comment.find({ 'userId': thisUser[0]._id.toString() })
        .exec(function(err, theseComments) {
          if (err) { return next(err) }
          res.json({ comments: theseComments })
        });
    });
}

export default { 
  index, 
  login_post, 
  user_read_get, 
  user_create_post, 
  user_update_put, 
  user_delete,
  comment_read_get 
}
