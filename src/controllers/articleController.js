import User from '../models/users.js';
import Article from '../models/articles.js';
import async from 'async';
import { body, validationResult } from "express-validator";

const article_create_post = function(req, res, next) {
    console.log("post initiated")

}

const article_update_put = function(req, res, next) {
    console.log("post update")
    const postToUpdate = await Article.findOne({_id: req.req.body.articleId})
  
    userToUpdate.save(err =>{
      if (err) { return next(err) }
      res.send("update successful")
    })

}

const article_delete_post = function(req, res, next) {
    const articleId = req.body.articleId
    
    User.findOneAndUpdate(
      {_id: req.body.userId},
      {$pull: { articles: req.body.articleId }
      }, function(err, id) {
        if (err) { return next(err) }
        
        Article.findByIdAndDelete(articleId, function(err, docs){
          if (err) { return next(err) }
          res.send("article deleted");
    })
  })
}

export default { article_create_post, article_update_put, article_delete_post }