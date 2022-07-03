const router = require('express').Router();
const uuidv4 = require('uuid');

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
        `POST HTTP method on user/${req.params.username} resource`,
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


module.exports = router;