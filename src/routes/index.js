const router = require('express').Router();
const session = require('./session');
const user = require('./user');
const articles = require('./articles');

/* Get home page */
router.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});

module.exports = router;