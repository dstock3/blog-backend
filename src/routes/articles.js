import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import article_controller from '../controllers/articleController.js'
import { verify } from '../auth/verify.js'
import { upload } from '../img/multer.js'

const router = Router();

// Articles

/* Get specific article */
router.get('/:articleId', article_controller.article_read_get);

/* Compose article */
router.post('/compose', [verify, upload.single('image')], article_controller.article_create_post);

/* Update specific article */
router.put('/:articleId', [verify, upload.single('image')], article_controller.article_update_put);

/* Delete specific article */
router.delete('/:articleId/', verify, article_controller.article_delete);

/* Get comments for a specific article */
router.get('/:articleId/comments', article_controller.comment_read_post)

/* Comment on specific article */
router.post('/:articleId/', verify, article_controller.comment_create_post);

/* Edit a comment */
router.put('/:articleId/:commentId', verify, article_controller.comment_update_put);

/* Delete a comment */
router.delete('/:articleId/:commentId', verify, article_controller.comment_delete );

export default router;