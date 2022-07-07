export function verifyToken(req, res, next) {
    if(typeof req.headers['authorization'] !== 'undefined') {
        req.token = req.headers['authorization'].split(' ')[1];
        next();
    } else {
        res.sendStatus(403)
    }
}

  