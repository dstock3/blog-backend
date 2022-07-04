import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import user_controller from '../controllers/userController'

const router = Router();

/* Get home page */
router.get('/', user_controller.index);

/* Get for Login page */
router.get('/login', (req, res) => {
    return res.send('Received a GET HTTP method');
});

/* Post for Login page */
router.post('/login', (req, res) => {
    return res.send('Received a POST HTTP method');
});

// Users

/* Get user landing page */
router.get('/:username', (req, res) => {
    return res.send('Received a GET HTTP method');
});

/* Get user profile */
router.get('/:username/profile', (req, res) => {
    return res.send('Received a GET HTTP method');
});

/* Create user profile */
router.post('/register', (req, res) => {
    return res.send(
        `POST HTTP method on /register resource`,
    );
});

/* Update user profile */
router.put('/:username/profile', (req, res) => {
    return res.send(
        `PUT HTTP method on user/${req.params.username}/profile resource`,
    );
});

/* Delete user profile */
router.delete('/:username/profile', (req, res) => {
    return res.send(
        `DELETE HTTP method on user/${req.params.userId}/profile resource`,
    );
});

export default router;