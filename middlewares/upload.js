const multer = require('multer')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.url === '/user/auth/signup' || req.url === '/user/change-details') {
            cb(null, './uploads/profilePics/');
        }
        if (req.url === '/post/create' || req.url.startsWith('/post/update')) {
            cb(null, './uploads/postPics/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, crypto.randomBytes(15).toString('hex') + '.jpg')
    }
})

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Wrong filetype uploaded'))
        }
    }
})
