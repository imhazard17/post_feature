const { json } = require('express')
const jwt = require('jsonwebtoken')

function authentication(req, res, next) {
    if (!req.headers.authorization) {
        res.status(401).json({
            err: 'You are not authorised to access this'
        })
        return;
    }

    const authToken = req.headers.authorization.split(' ')[1]

    try {
        const jwtDecode = jwt.verify(authToken, process.env.JWT_SECRET)
        req.locals = {}
        req.locals.userId = parseInt(jwtDecode);
        next()
    } catch {
        res.status(401).json({
            err: 'You are not authorised to access this'
        })
        return;
    }
}

module.exports = authentication
