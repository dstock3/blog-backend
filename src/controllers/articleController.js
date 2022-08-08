import User from '../models/users.js';
import Article from '../models/articles.js';
import Comment from '../models/comments.js';
import async from 'async';
import { body, validationResult } from "express-validator";
import { uploadMiddleware, validateImage } from '../img/multer.js'
import { parseJwt } from '../auth/parseToken.js'
import comments from '../models/comments.js';

const article_read_get = async function(req, res) {
  Article.findById(req.params.articleId, 'title img imgDesc date content comments')
    .populate('comments')
    .exec(function(err, thisArticle) {
      let articleId = thisArticle._id.toString()

      User.find({}, 'profileName admin profileDesc profilePic themePref layoutPref blogTitle articles')
        .populate('articles')
        .exec(function(err, users) {
          let author
          
          if (users) {
            for (let prop in users) {
              let user = users[prop]
              for (let i = 0; i < user.articles.length; i++) {
                let article = user.articles[i]
    
                if (article._id.toString() === articleId) {
                  author = user
                };
              };
            };
          };
          
        if (err) { return next(err) }
        res.json({ article: thisArticle, author: author })
      })
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
    const token = req.header('login-token');
    const parsedToken = parseJwt(token);
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.errors })
    }

    const articleTitle = Buffer.from(req.body.title, "utf-8").toString();
    const articleContent = Buffer.from(req.body.content, "utf-8").toString();
    try {
      if (req.body.img) {
        const article = new Article({
          title: articleTitle,
          img: req.body.img,
          imgDesc: req.body.imgDesc,
          content: articleContent
        });

        article.save(err => {
          if (err) { return next(err) }

          User.findByIdAndUpdate(parsedToken._id)
            .populate('articles')
            .exec(function(err, thisUser) {
              thisUser.articles.push(article)
              thisUser.save(err => {
                if (err) { return next(err) }
                res.json({ 
                  message: 'article posted', articleId: article._id
                });
              });
            });
        });
      } else {
        console.log(articleTitle)
        console.log(articleContent)
        const article = new Article({
          title: articleTitle,
          content: articleContent
        });

        article.save(err => {
          if (err) { return next(err) }

          User.findByIdAndUpdate(parsedToken._id)
            .populate('articles')
            .exec(function(err, thisUser) {
              thisUser.articles.push(article)
              thisUser.save(err => {
                if (err) { return next(err) }
                res.json({ 
                  message: 'article posted', articleId: article._id 
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

const article_update_put = [
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
  async (req, res, next) => {
    const token = req.header('login-token');
    const parsedToken = parseJwt(token);
    let authorized = false;

    let imgMessages = false
    if (req.file) { imgMessages = validateImage(req.file) }
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.errors })
    } else {
      let updatedArticle
      
      if (req.file && !imgMessages) {
        updatedArticle = {
          title: req.body.title,
          img: req.file.originalname,
          imgDesc: req.body.imgDesc,
          content: req.body.content,
        };
      } else {
        updatedArticle = {
          title: req.body.title,
          content: req.body.content,
        };
      }
      
      Article.findByIdAndUpdate(req.params.articleId, updatedArticle, {}, function(err, thisArticle) {
        if (err) { return next(err); }

        User.findById(parsedToken._id)
          .exec(function(err, thisUser) {
            if (err) { return next(err) }

            for (let i = 0; i < thisUser.articles.length; i++) {
              if (thisUser.articles[i]._id.toString() === req.params.articleId) {
                authorized = true
              };
            };

            if (authorized) { 
              res.json({ message: "article updated!", articleId: req.params.articleId });
            } else { 
              res.json({ message: "unauthorized" }) 
            };
          });
      });
    } 
  }
]

const article_delete = function(req, res, next) {
  const token = req.header('login-token');
  const parsedToken = parseJwt(token);
  let authorized = false;

  User.findOneAndUpdate(
    {_id: parsedToken._id },
    {$pull: { articles: req.params.articleId }}, 
    
    function(err, thisUser) {
      if (err) { return next(err) }
      for (let i = 0; i < thisUser.articles.length; i++) {
        let thisArticleId = thisUser.articles[i]._id.toString()
        if (thisArticleId === req.params.articleId) {
          authorized = true
        }
      }
      if (authorized) {
        Article.findByIdAndDelete(req.params.articleId, function(err, thisArticle) {
          if (err) { return next(err) }
          res.json({ message: "article deleted" });
        });
      } else { res.json({ message: "unauthorized" })}
  });
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
    const token = req.header('login-token');
    const parsedToken = parseJwt(token);

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.errors })
    }

    try {
      const comment = new Comment({
        profileName: req.body.profileName,
        userId: parsedToken._id,
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

              res.json({ message: 'comment posted', comments: thisArticle.comments })
            });
        });
      });
    } catch(err) {
      return next(err) 
    }
  }
]

const comment_update_put = [
    // Validate fields
    body('content', 'Your comment must be at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req)

    const token = req.header('login-token');
    const parsedToken = parseJwt(token);
  
    let newComment = {
      profileName: req.body.profileName,
      userId: parsedToken._id,
      content: req.body.content
    }

    Comment.findByIdAndUpdate(req.params.commentId, newComment, function(err, thisComment) {
      if (thisComment.userId.toString() === parsedToken._id) {
        thisComment.save(err => {
          if (err) { return next(err) }
          res.json({ message: 'comment updated' })
        });
      } else { res.json({ message: 'unauthorized' }) }
    });
  }
]

const comment_delete = function(req, res, next) {
  const token = req.header('login-token');
  const parsedToken = parseJwt(token);

  let articleAuthor
  let authorized = false

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
      if (parsedToken._id === data.comment.userId._id.toString()) {
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
}

const commented_read_get = function(req, res) {
  async.parallel({
    articles: function(cb) {
      Article.find({}, 'title content comments')
      .populate('comments')
      .exec(cb)
    },
    users: function(cb) {
      User.find({}, 'profileName articles')
      .populate('profileName')
      .populate('articles')
      .exec(cb)
    }
  }, function(err, results) {
    if (err) { return next(err) }
    let countList = []
    let theseArticles = results.articles
    for (let prop in theseArticles) {
      if (theseArticles[prop].comments.length !== 0) {
        countList.push(theseArticles[prop])   
      }
    };

    let userList = []

    for (let prop in results.users) {
      for (let i = 0; i < countList.length; i++) {
        for (let y = 0; y < results.users[prop].articles.length; y++) {
          if (results.users[prop].articles[y]._id.toString() === countList[i]._id.toString()) {
            userList.push({"user": results.users[prop].profileName, "article": countList[i]})
          };
        };
      };
    };

    let sortedCount = userList.sort((a,b) => b.article.comments.length - a.article.comments.length); 

    let mostCommented = []
    
    for (let i = 0; i < 5; i++) {
      mostCommented.push(sortedCount[i])
    }

    res.json({ mostCommented })
  });
}

export default {
  article_read_get, 
  article_create_post, 
  article_update_put, 
  article_delete,
  comment_read_post,  
  comment_create_post,
  comment_update_put, 
  comment_delete,
  commented_read_get
}