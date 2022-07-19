import User from '../models/users.js';
import Article from '../models/articles.js';
import async from 'async';
import { body, validationResult } from "express-validator";

const article_create_post = [
  body('title').trim().isLength({max: 150}).escape().withMessage('The title of your article cannot exceed 150 characters.'),
  body('imgDesc').trim().isLength({max: 150}).escape().withMessage('Your image description cannot exceed 150 characters.'),
  body('content').isEmpty().trim().escape().withMessage('Please include the content of your article.'),

  (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.errors })
    }

    if (err) { 
      res.json({ message: "login validation check failed" })
    } else {
      try {
        if (img) {
          const article = new Article({
            title: req.body.title,
            img: req.body.img,
            imgDesc: req.body.imgDesc,
            content: req.body.content,
            blogTitle: req.body.blogTitle
          });

          article.save(err => {
            if (err) { return next(err) }
            res.json({ 
              message: 'article posted', 
              user: req.user  
            })
          })

        } else {
          const article = new Article({
            title: req.body.title,
            content: req.body.content,
            blogTitle: req.body.blogTitle
          });

          article.save(err => {
            if (err) { return next(err) }
            res.json({ 
              message: 'article posted', 
              user: req.user  
            })
          })
        }
      } catch(err) { 
        return next(err) 
      }
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
  
export default { article_create_post, article_update_put, article_delete_post }