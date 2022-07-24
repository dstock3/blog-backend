import User from '../models/users.js';
import Article from '../models/articles.js';
import Comment from '../models/comments.js';
import async from 'async';
import { body, validationResult } from "express-validator";
import { validateImage } from '../img/multer.js'
import { parseJwt } from '../auth/parseToken.js'

const article_read_get = function(req, res) {
  Article.findById(req.params.articleId, 'title img imgDesc date content comments')
    .populate('comments')
    .exec(function(err, thisArticle) {
      if (err) { return next(err) }
      res.json({ article: thisArticle })
    })
}

const article_create_post = [
  // Validate fields
  body('title', 'The title of your article cannot exceed 150 characters.')
    .trim()
    .isLength({ max: 150 })
    .escape(),
  body('content', 'Your article must be at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('imgDesc', 'Your image description cannot exceed 150 characters.')
    .trim()
    .isLength({max: 150})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.errors })
    }
    
    try {
      if (req.body.img) {
        const article = new Article({
          title: req.body.title,
          img: req.body.img,
          imgDesc: req.body.imgDesc,
          content: req.body.content
        });

        article.save(err => {
          if (err) { return next(err) }

          User.findByIdAndUpdate(req.body.userId)
            .populate('articles')
            .exec(function(err, thisUser) {
              thisUser.articles.push(article)
              thisUser.save(err => {
                if (err) { return next(err) }
                res.json({ 
                  message: 'article posted' 
                });
              });
            });
        });
      } else {
        const article = new Article({
          title: req.body.title,
          content: req.body.content
        });

        article.save(err => {
          if (err) { return next(err) }

          User.findByIdAndUpdate(req.body.userId)
            .populate('articles')
            .exec(function(err, thisUser) {
              thisUser.articles.push(article)
              thisUser.save(err => {
                if (err) { return next(err) }
                res.json({ 
                  message: 'article posted' 
                });
              })
            });
        });
      }
    } catch(err) { 
      return next(err) 
    }
  }
];

const article_update_put = async function(req, res, next) {
  if (err) { 
    res.json({ message: "login validation check failed" })
  } else {
    const postToUpdate = await Article.findOne({_id: req.body.articleId})

    postToUpdate.save(err => {
      if (err) { return next(err) }
      res.json({ 
        message: "update successful", 
        user: req.user 
      })
    });
  }
};
  
const article_delete = function(req, res, next) {
  const token = req.header('login-token');
  const parsedToken = parseJwt(token)
  if (parsedToken._id === req.body.userId) {
    User.findOneAndUpdate(
      {_id: req.body.articleId },
      {$pull: { articles: req.body.articleId }}, 
      
      function(err, thisUser) {
        if (err) { return next(err) }
        Article.findByIdAndDelete(req.body.articleId , function(err, thisArticle) {
          if (err) { return next(err) }
          res.json({ message: "article deleted" });
        });
    });
  };
};

const comment_read_post = function(req, res) {
  Article.findById(req.params.articleId, 'comments')
    .populate('comments')
    .exec(function(err, thisArticle) {
      if (thisArticle.comments) {
        res.json({ comments: thisArticle.comments })
      }
    })
}

const comment_create_post = [
  // Validate fields
  body('content', 'Your comment must be at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.errors })
    }

    try {
      const comment = new Comment({
        profileName: req.body.profileName,
        userId: req.body.userId,
        content: req.body.content
      });

      comment.save(err => {
        Article.findByIdAndUpdate(req.params.articleId)
          .populate('comments')
          .exec(function(err, thisArticle) {
            if (err) { return next(err) }
            thisArticle.comments.push(comment)
            thisArticle.save(err => {
              if (err) { return next(err) }
              res.json({ message: 'comment posted' })
            });
        });
      })
    } catch(err) {
      return next(err) 
    }
  }
]

const comment_update_put = function(req, res, next) {
  res.send("edit request received!")
}

const comment_delete = function(req, res, next) {
  const token = req.header('login-token');
  const parsedToken = parseJwt(token);

  let articleAuthor
  let authorized = false

  if (req.body.userId === parsedToken._id) {
    async.parallel({
      comment: function(cb) {
        Comment.findById(req.params.commentId, 'profileName userId')
          .populate('userId')
          .exec(cb)
      },
      users: function(cb) {
        User.find()
        .populate('articles')
        .exec(cb)
      }
    }, function(err, data) {
      if (err) { return next(err) }

      for (let prop in data.users) {
        let user = data.users[prop]
        for (let i = 0; i < user.articles.length; i++) {
          let article = user.articles[i]

          if (article._id.toString() === req.params.articleId) {
            articleAuthor = user
          };
        };
      };

      if (articleAuthor) {
        if (parsedToken._id === articleAuthor._id.toString()) {
          authorized = true;
        };
      };

      if (data.comment) {
        if (data.comment.userId._id.toString()=== req.body.userId) {
          authorized = true;
        };
      }

      if (authorized) {
        Article.findOneAndUpdate(
          {_id: req.params.articleId },
          {$pull: { comments: req.params.commentId }}, 
          function(err, thisArticle) {
            Comment.findByIdAndDelete(req.params.commentId , function(err, thisComment) {
              if (err) { return next(err) }
              res.json({ message: "comment deleted" })
            });
          });
        } else {
          if (!authorized) {
            res.json({ message: "unauthorized" })
          } else {
            res.json({ message: "error" })
          }
        };
    });
  };
}

export default {
  article_read_get, 
  article_create_post, 
  article_update_put, 
  article_delete,
  comment_read_post,  
  comment_create_post,
  comment_update_put, 
  comment_delete
}