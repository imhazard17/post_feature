const { Prisma } = require("@prisma/client")

function error(error, req, res, next) {
    console.log(error)
    if (error.message === 'Wrong filetype uploaded') {
        res.status(400).json({
            err: error.message
        })
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code.startsWith('P20')) {
            res.status(404).json({
                err: 'Wrong inputs sent'
            })
        } else {
            res.status(403).json({
                err: 'Error in fetching the request'
            })
        }
    } else {
        res.status(500).json({
            err: 'Error in fetching the request'
        })
    }
}

module.exports = error
