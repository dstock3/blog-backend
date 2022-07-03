const router = require('express').Router();
const uuidv4 = require('uuid');

// Articles

/* Get specific article */
router.get('/:username/:articleId', (req, res) => {
    return res.send('Received a GET HTTP method');
});

/* Compose article */
router.post('/:username/compose', (req, res) => {
    return res.send(
        `POST HTTP method on /compose resource`,
    );
});

/* Update specific article */
router.put('/:username/:articleId', (req, res) => {
    return res.send(
        `PUT HTTP method on username/${req.params.articleId} resource`,
    );
});

/* Delete specific article */
router.delete('/:username/:articleId', (req, res) => {
    return res.send(
        `DELETE HTTP method on username/${req.params.articleId} resource`,
    );
});

module.exports = router;