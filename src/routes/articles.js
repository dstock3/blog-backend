import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const router = Router();

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

export default router;