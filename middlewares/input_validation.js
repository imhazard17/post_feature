const z = require('zod')

const userSchema = z.object({
    username: z.string().min(5).max(30),
    password: z.string().min(8).max(40),  // =VISIT=  Implement regex for password validation
    firstName: z.string().max(30).optional(),
    lastName: z.string().max(30).optional(),
})

const postSchema = z.object({
    description: z.string().max(500).optional(),
})

const commentSchema = z.object({
    content: z.string().min(1).max(200),
})

function userInputValidation(req, res, next) {
    // const passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,40}$";

    try {
        userSchema.parse(req.body)
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    } finally {
        next()
    }
}

function uplUserInputValidation(req, res, next) {
    // const passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,40}$";

    try {
        userSchema.parse({
            username: req.headers.username,
            password: req.headers.password,
            firstName: req.headers.firstName,
            lastName: req.headers.lastName,
        })
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    } finally {
        next()
    }
}

function postInputValidation(req, res, next) {
    try {
        postSchema.parse(req.body)
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    } finally {
        next()
    }
}

function uplPostInputValidation(req, res, next) {
    try {
        postSchema.parse({
            description: req.headers.description,
        })
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    } finally {
        next()
    }
}

function commentInputValidation(req, res, next) {
    try {
        commentSchema.parse(req.body)
    } catch {
        return res.status(411).json({
            err: 'Wrong inputs recieved'
        })
    } finally {
        next()
    }
}

module.exports = {
    userInputValidation,
    uplUserInputValidation,
    postInputValidation,
    uplPostInputValidation,
    commentInputValidation
}
