import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import article_controller from '../controllers/articleController.js'
import { verifyToken } from '../auth/verify.js'

const router = Router();

// Articles

/* Compose article */
router.post('/compose', verifyToken, article_controller.article_create_post);

/* Update specific article */
router.put('/:articleId', verifyToken, article_controller.article_update_put);

/* Delete specific article */
router.delete('/:articleId', verifyToken, article_controller.article_delete_post);

export default router;