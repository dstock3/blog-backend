import User from '../models/users';
import Article from '../models/articles';
import async from 'async';
import { body, validationResult } from "express-validator";

const article_create_post = function(req, res, next) {
    console.log("post initiated")

}

const article_update_post = function(req, res, next) {
    console.log("post update")

}

const article_delete_post = function(req, res, next) {
    console.log("post delete")

}

export default { article_create_post, article_update_post, article_delete_post }