import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import user_controller from '../controllers/userController.js'
import { verify } from '../auth/verify.js'
import { upload } from '../img/multer.js'

const router = Router();

/* Get home page */
router.get('/', user_controller.index);

/* Post for Login page */
router.post('/login', user_controller.login_post);

/* Post for Logout page */
router.post('/logout', user_controller.logout_post)

// Users

/* Create user profile */
router.post('/register', upload.single('image'), user_controller.register_post);

/* Update user profile */
router.put('/:username/update', verify, upload.single('image'), user_controller.user_update);

/* Delete user profile */
router.delete('/:username/delete', verify, user_controller.user_delete);

export default router;