require('dotenv/config');
const express = require('express');
const cors = require('cors');
const models = require('./models');
const uuidv4 = require('uuid');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

/* Get home page */
app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});

// USERS

/* Get user landing page */
app.get('/:username', (req, res) => {
    return res.send('Received a GET HTTP method');
});

// Users

/* Get user profile */
app.get('/:username/profile', (req, res) => {
    return res.send('Received a GET HTTP method');
});

/* Create user profile */
app.post('/register', (req, res) => {
    return res.send(
        `POST HTTP method on user/${req.params.username} resource`,
    );
});

/* Update user profile */
app.put('/:username/profile', (req, res) => {
    return res.send(
        `PUT HTTP method on user/${req.params.username}/profile resource`,
    );
});

/* Delete user profile */
app.delete('/:username/profile', (req, res) => {
    return res.send(
        `DELETE HTTP method on user/${req.params.userId}/profile resource`,
    );
});

// Articles

/* Get specific article */
app.get('/:username/:articleId', (req, res) => {
    return res.send('Received a GET HTTP method');
});

/* Compose article */
app.post('/:username/compose', (req, res) => {
    return res.send(
        `POST HTTP method on /compose resource`,
    );
});

/* Update specific article */
app.put('/:username/:articleId', (req, res) => {
    return res.send(
        `PUT HTTP method on username/${req.params.articleId} resource`,
    );
});

/* Delete specific article */
app.delete('/:username/:articleId', (req, res) => {
    return res.send(
        `DELETE HTTP method on username/${req.params.articleId} resource`,
    );
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);