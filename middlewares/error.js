const { Prisma } = require("@prisma/client")

function error(e, req, res, next) {
    console.log(e)
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code.startsWith('P20')) {
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
