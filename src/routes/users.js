import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import user_controller from '../controllers/userController.js'

const router = Router();

/* Get home page */
router.get('/', user_controller.index);

/* Post for Login page */
router.post('/login', user_controller.login_post);

// Users

/* Create user profile */
router.post('/register', user_controller.register_post);

/* Update user profile */
router.put('/:username', user_controller.user_update);

/* Delete user profile */
router.delete('/:username', user_controller.user_delete);

export default router;