import jwt from 'jsonwebtoken';

function verify(req, res, next) {
    const thisToken = req.header('login-token');

    if (!thisToken) return res.status(401).json({ message: 'Invalid credentials.' });

    try {
        const isVerified = jwt.verify(thisToken, process.env.secretkey);
        res.user = isVerified;
        next()
    } catch(err) {
        res.status(400).json({ message: 'This Web Token is Invalid' })
    }
}

export { verify }