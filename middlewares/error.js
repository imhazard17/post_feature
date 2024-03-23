const { Prisma } = require("@prisma/client")

function error(error, req, res, next) {
    console.log(error)
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({
            err: 'Too many files uploaded'
        })
        return
    }
    if (error.message === 'Wrong filetype uploaded') {
        return res.status(400).json({
            err: error.message
        })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code.startsWith('P20')) {
            return res.status(404).json({
                err: 'Wrong inputs sent'
            })
        } else {
            return res.status(403).json({
                err: 'Error in fetching the request'
            })
        }
    }
    else {
        return res.status(500).json({
            err: 'Error in fetching the request'
        })
    }
}

module.exports = error
