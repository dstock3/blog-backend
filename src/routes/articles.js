import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import article_controller from '../controllers/articleController'

const router = Router();

// Articles

/* Compose article */
router.post('/:username/compose', article_controller.article_create_post);

/* Update specific article */
router.put('/:username/:articleId', article_controller.article_update_post);

/* Delete specific article */
router.delete('/:username/:articleId', article_controller.article_delete_post);

export default router;