const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!token) return res.status(401).send( 'Access Denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'YOUR_SECRET_KEY' with your actual secret key
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = verifyToken;
