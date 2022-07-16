import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import user_controller from '../controllers/userController.js'
import { verifyToken } from '../auth/verify.js'

const router = Router();

/* Get home page */
router.get('/', user_controller.index);

/* Post for Login page */
router.post('/login', user_controller.login_post);

router.post('/logout', user_controller.logout_post)

// Users

/* Create user profile */
router.post('/register', user_controller.register_post);

/* Update user profile */
router.put('/:username', verifyToken, user_controller.user_update);

/* Delete user profile */
router.delete('/:username', verifyToken, user_controller.user_delete);

export default router;