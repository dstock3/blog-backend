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

// Users

/* Get user profile */ 
router.get('/:username/', user_controller.user_read_get);

/* Create user profile */
router.post('/register', upload.single('profilePic'), user_controller.user_create_post);

/* Update user profile */
router.put('/:username/update', [verify, upload.single('profilePic')], user_controller.user_update_put);

/* Delete user profile */
router.delete('/:username/delete', verify, user_controller.user_delete);

/* Delete user profile from admin account */
router.delete('/:username', verify, user_controller.user_admin_delete);

/* Get comments for a specific user */
router.get('/:username/comments', user_controller.comment_read_get);

/* Get profile pic for a specific user */
router.get('/images/:key', user_controller.pic_read_get)

export default router;