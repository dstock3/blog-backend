import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import article_controller from '../controllers/articleController.js'
import { verifyToken } from '../controllers/userController.js'

const router = Router();

// Articles

/* Compose article */
router.post('/article/compose', verifyToken, article_controller.article_create_post);

/* Update specific article */
router.put('/article/:articleId', verifyToken, article_controller.article_update_put);

/* Delete specific article */
router.delete('/article/:articleId', verifyToken, article_controller.article_delete_post);

export default router;