import User from '../models/users.js'
import Comment from '../models/comments.js';
import async from 'async';
import { body, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateImage } from '../img/multer.js';
import { parseJwt } from '../auth/parseToken.js';
import { format } from 'date-fns';
import { uploadFile, getFileStream } from '../../s3.js'
import 'dotenv/config';

const index = async function(req, res, next) {
  try {
    const results = await User.find({}, 'profileName email admin profileDesc profilePic themePref layoutPref blogTitle dateJoined articles')
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
      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.status(200).json({
        users: results,
        user: res.user
      });
    } else {
      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.status(200).json({
        users: results
      });
    };
  } catch(err) { return next(err) }
};

const login_post = async function (req, res) {
  const user = await User.findOne({ 'email': req.body.email })
  if(!user) return res.status(400).json({ message: "This email does not exist." });

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) return res.status(401).send({ message: "Your login credentials are incorrect." });

  const webToken = jwt.sign({ _id: user.id}, process.env.secretkey, { expiresIn: '60m'} );
  res.header('login-token', webToken).send(webToken)
};

const user_read_get = async function(req, res) {
  User.find({ 'profileName': req.params.username }, 'profileName email profileDesc profilePic blogTitle dateJoined themePref layoutPref articles')
    .populate('articles')
    .exec(function(err, thisUser) {
      if (err) { return next(err) }
      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.json({ user: thisUser })
    });
}

const user_create_post = [
  // Validate fields
  body('profileName', 'Your username must be at least four characters long.')
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body('email', 'Please enter a valid e-mail address.')
    .trim()
    .isEmail(),
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

    let imgMessages

    if (req.file) { 
      imgMessages = validateImage(req.file)
    }

    if (!errors.isEmpty() || (imgMessages.length > 0)) {
      return res.json({ errors: errors.errors, imgErrors: imgMessages })
    }
    
    try {
      const userExists = await User.findOne({profileName: req.body.profileName});

      if (req.file) {
        const imageUpload = await uploadFile(req.file)
        console.log(imageUpload)
      }

      if (userExists !== null) {
         return res.json({ userExists: true })
      }

      const timestamp = format(new Date(), "MMMM do, yyyy");

      let isAdmin = false
      if (req.body.password === process.env.admin) {
        isAdmin = true
      }
        
      bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
        const user = new User({
          profileName: req.body.profileName,
          email: req.body.email,
          password: hashedPassword,
          admin: isAdmin,
          profileDesc: req.body.profileDesc,
          blogTitle: req.body.blogTitle,
          profilePic: req.file.filename,
          dateJoined: timestamp
        })

        user.save(err => {
          if (err) { return next(err) }
          
          res.json({
            message: 'registration successful',
            profilePic: `images/${imageUpload.Key}`
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
  body('email', 'Please enter a valid e-mail address.')
    .trim()
    .isEmail(),
  body('password', 'Your password must be at least five characters long.')
    .trim()
    .isLength({ min: 5 })
    .escape(),

    async (req, res, next) => {
      const token = req.header('login-token');
      const parsedToken = parseJwt(token);

      const errors = validationResult(req);

      let imgMessages

      if (req.file) { 
        imgMessages = validateImage(req.file)

        const imageUpload = await uploadFile(req.file)
        console.log(imageUpload)
      }
      
      if (!errors.isEmpty() || (imgMessages.length > 0)) {
        return res.json({ errors: errors.errors, imgErrors: imgMessages })
      }

      bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
        const updatedUser = {
          email: req.body.email,
          profileName: req.body.profileName,
          password: hashedPassword,
          admin: false,
          profileDesc: req.body.profileDesc,
          themePref: req.body.themePref,
          layoutPref: req.body.layoutPref,
          profilePic: req.file.filename,
          blogTitle: req.body.blogTitle,
        }

        User.find({"profileName": req.params.username})
          .exec(function(err, thisUser) {
            if (thisUser[0]._id.toString() === parsedToken._id) {
              User.findByIdAndUpdate(parsedToken._id, updatedUser, {}, function (err, updatedUser) {
                if (err) { return next(err) }
                res.json({ 
                  message: "Update Successful"
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

const user_admin_delete = function(req, res, next) {
  const token = req.header('login-token');
  const parsedToken = parseJwt(token);

  async.parallel({
    user: function(cb) {
      User.find({ 'profileName': req.params.username }, 'profileName')
      .populate('profileName')
      .exec(cb)
    },
    users: function(cb) {
      User.find({}, 'profileName admin')
      .populate('profileName')
      .populate('admin')
      .exec(cb)
    }
  }, function(err, results) {
    let authorized = false
    let userId
    for (let prop in results.users) {
      if (parsedToken._id === results.users[prop]._id.toString()) {
        console.log(results.users[prop].admin)
        if (results.users[prop].admin) {
          authorized = true
        };
      };
      
      if (req.params.username=== results.users[prop].profileName) {
        userId = results.users[prop]._id.toString()
      };
    };

    if (authorized && userId) {
      User.findByIdAndDelete(userId, function(err, thisUser) {
        if (err) { return next(err) }
        res.json({
          message: `User Deleted`
        });
      });
    } else {
      res.status(400).send("Authentication Error")
    };
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

const pic_read_get = function(req, res) {
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
}

export default { 
  index, 
  login_post, 
  user_read_get, 
  user_create_post, 
  user_update_put, 
  user_delete,
  user_admin_delete,
  comment_read_get,
  pic_read_get
}
