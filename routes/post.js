const express = require('express')
const router = express.Router()
const prisma = require('../utils/db')
const authentication = require('../middlewares/authentication')
const upload = require('../middlewares/upload')
const { postInputValidation } = require('../middlewares/input_validation')
const fs = require('node:fs/promises')
const errForward = require('../utils/errorForward')

// GET /post/search/:id
router.get('/search/:id', errForward(
    async (req, res) => {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                _count: {
                    comments: true,
                    likes: true
                }
            }
        })

        if (!post) {
            return res.status(404).json({
                err: `No post with id: ${req.params.id} found`,
            })
        }

        post.username = post.user.username
        delete post.user

        return res.status(200).json({ msg: post })
    }
))

// GET /post/get-all/:username
router.get('/get-all/:username', errForward(
    async (req, res) => {
        const username = req.params.username

        const user = prisma.user.findUnique({
            where: {
                username: username
            },
            include: {
                posts: true
            }
        })

        if (!user) {
            return res.status(404).json({
                err: `No username ${username} found`,
            })
        }

        return res.status(200).json({ msg: user.posts })
    }))

// POST /post/create
router.post('/create', [postInputValidation, authentication, upload.array("file", 7)], errForward(async (req, res) => {
    const userId = req.locals.userId;

    if (!req.files) {
        return res.status(404).json({
            err: 'No images uploaded',
        })
    }

    const uploadedFilePaths = req.files.map((file) => file.path)

    const createdPost = await prisma.post.create({
        data: {
            userId: userId,
            description: req.body.description,
            imgUrls: uploadedFilePaths,
        },
        select: {
            id: true
        }
    })

    if (!createdPost) {
        return res.status(404).json({
            err: `No username ${username} found`,
        })
    }

    return res.status(200).json({
        msg: `Successfully created post with post id: ${createdPost.id}`
    })
}))

// PUT /post/update/:id
router.put('/update/:id', [postInputValidation, authentication, upload.array('file', 7)], errForward(async (req, res) => {
    const postId = parseInt(req.params.id)

    if (!req.files) {
        return res.status(404).json({
            err: 'No images uploaded',
        })
    }

    const uploadedFilePaths = req.files.map((file) => file.path)

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
            userId: req.locals.userId,
        },
        select: {
            imgUrls: true
        }
    })

    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            description: req.body.description,
            imgUrls: uploadedFilePaths,
        },
        select: {
            id: true,
        }
    })

    const prevImgPaths = post.imgUrls

    for (let i = 0; i < prevImgPaths.length; i++) {
        await fs.unlink(prevImgPaths[i])
    }

    if (!updatedPost) {
        return res.status(404).json({
            err: 'Could not update post',
        })
    }

    return res.status(200).json({
        msg: `Successfully updated post with post id: ${updatedPost.id}`
    })
}))

// DELETE /post/delete/:id
router.delete('/:id', [authentication], errForward(
    async (req, res) => {
        const postId = parseInt(req.params.id);

        const deletedPost = await prisma.post.delete({
            where: {
                id: postId,
                userId: req.locals.userId,
            },
            select: {
                id: true,
            }
        })

        if (!deletedPost) {
            return res.status(404).json({
                err: 'Could not delete post',
            })
        }

        return res.status(200).json({
            msg: `Successfully deleted post with post id: ${deletedPost.id}`
        })
    }
))

module.exports = router
