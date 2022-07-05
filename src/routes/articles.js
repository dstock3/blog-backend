import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import article_controller from '../controllers/articleController.js'

const router = Router();

// Articles

/* Compose article */
router.post('/article/compose', article_controller.article_create_post);

/* Update specific article */
router.put('/article/:articleId', article_controller.article_update_post);

/* Delete specific article */
router.delete('/article/:articleId', article_controller.article_delete_post);

export default router;