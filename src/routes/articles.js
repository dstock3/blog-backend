import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import article_controller from '../controllers/articleController.js'
import { verify } from '../auth/verify.js'

const router = Router();

// Articles

/* Compose article */
router.post('/compose', verify, article_controller.article_create_post);

/* Update specific article */
router.put('/:articleId', verify, article_controller.article_update_put);

/* Delete specific article */
router.delete('/:articleId', verify, article_controller.article_delete_post);

export default router;