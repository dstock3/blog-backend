import User from '../models/users.js';
import Article from '../models/articles.js';
import Comment from '../models/comments.js';
import async from 'async';
import { body, validationResult } from "express-validator";
import { validateImage } from '../img/multer.js'

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
              })
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
  
const article_delete_post = function(req, res, next) {
  if (err) { 
    res.json({ message: "login validation check failed" })
  } else {
    const articleId = req.body.articleId

    User.findOneAndUpdate(
      {_id: req.body.userId },
      {$pull: { articles: req.body.articleId }
      }, function(err, id) {
        if (err) { return next(err) }
        
        Article.findByIdAndDelete(articleId, function(err, docs){
          if (err) { return next(err) }
          res.json({ 
            message: "article deleted", 
            user: req.user  
          });
        });
      });
  };
}

const article_create_comment = [
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
        profileName: req.body.userId,
        content: req.body.content
      });

      comment.save(err => {
        Article.findByIdAndUpdate(req.body.articleId)
          .populate('comments')
          .exec(function(err, thisArticle) {
            thisArticle.comments.push(comment)
            thisArticle.save(err => {
              if (err) { return next(err) }
              res.json({ message: 'comment posted' })
            })
            
          })
      })
    } catch(err) {
      return next(err) 
    }
  }
]
const article_edit_comment = function(req, res, next) {
  res.send("edit request received!")
}

const article_delete_comment = function(req, res, next) {
  res.send("delete request received!")
}
  
export default { article_create_post, article_update_put, article_delete_post, article_create_comment, article_edit_comment, article_delete_comment }