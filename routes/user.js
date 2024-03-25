const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication')
const prisma = require('../utils/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const upload = require('../middlewares/upload')
const { userInputValidation, uplUserInputValidation } = require('../middlewares/input_validation')
const fs = require('node:fs/promises')
const errForward = require('../utils/errorForward')

// GET /user/all (get all users)
router.get('/all', errForward(async (req, res) => {
    const users = await prisma.user.findMany()

    res.json(users)
}))

// GET /user/my-details (get current logged in user)
router.get('/my-details', [authentication], errForward(async (req, res) => {
    const userId = req.locals.userId;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            posts: true,
            comments: true,
            _count: {
                select: {
                    posts: true,
                    comments: true,
                    likes: true
                }
            }
        }
    })

    if (!user) {
        return res.status(404).json({
            err: 'Error getting user details'
        })

    }

    delete user.password
    return res.status(200).json(user)
}))

// GET /user/search/:username
router.get('/search/:username', errForward(async (req, res) => {
    const username = req.body.username;

    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
        include: {
            posts: true,
            _count: {
                select: {
                    posts: true,
                }
            }
        }
    })

    if (!user) {
        return res.status(404).json({
            err: `No user with username: ${username} exists`
        })
    }

    res.json(user)
}))

// POST /user/auth/signup
router.post('/auth/signup', uplUserInputValidation, upload.single('file'), errForward(async (req, res) => {
    const createdUser = await prisma.user.create({
        data: {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dpUrl: req.file?.path,
        },
        select: {
            id: true
        },
    })

    if (!createdUser) {
        return res.status(404).json({
            err: 'Could not create account'
        })
    }

    const token = jwt.sign(createdUser.id, process.env.JWT_SECRET)

    return res.status(201).json({
        msg: `successfully created account with username: ${req.body.username}`,
        authToken: token
    })
}))

// GET /user/auth/login
router.get('/auth/login', userInputValidation, errForward(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        },
        select: {
            id: true,
            username: true,
            password: true
        }
    })

    if (!user) {
        return res.status(404).json({
            err: 'Username or password incorrect'
        })
    }

    if (bcrypt.compareSync(req.body.password, user.password) === false) {
        return res.status(404).json({
            err: 'Username or password incorrect'
        })
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET)

    return res.status(200).json({
        msg: `successfully logged into account with username: ${user.username}`,
        authToken: token
    })
}))

// PUT /user/change-details (change logged in user's profile details)
router.put('/change-details', uplUserInputValidation, authentication, upload.single('file'), errForward(async (req, res) => {
    const userId = req.locals.userId;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            dpUrl: true,
        }
    })

    if(user.dpUrl) {
        await fs.unlink(dpUrl)
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: bcrypt.hash(req.body.password, 10),
            dpUrl: req.file?.path,
        },
        select: {
            username: true,
            firstName: true,
            lastName: true,
        }
    })

    if (!updatedUser) {
        return res.status(404).json({
            err: "Could not update user details maybe due to username clash"
        })
    }

    return res.status(200).json({
        msg: `User updated successfully with deatials: ${updatedUser}`
    })
}))

// DELETE /user/delete-profile (delete account of current logged in user)
router.delete('/delete-profile', [authentication], errForward(async (req, res) => {
    const userId = req.locals.userId;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            dpUrl: true,
        }
    })

    if(user.dpUrl) {
        await fs.unlink(dpUrl)
    }

    const deletedUser = await prisma.user.delete({
        where: {
            id: userId,
        }
    })

    if (!deletedUser) {
        return res.status(404).json({
            err: "Could not delete user"
        })
    }

    return res.status(200).json({
        msg: "User deleted successfully"
    })
}))

module.exports = router
