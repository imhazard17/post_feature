const express = require('express')
const router = express.Router()
const prisma = require('../utils/db')
const authentication = require('../middlewares/authentication')
const errForward = require('../utils/errorForward')

// GET /like/count/:postId (number of likes on a post)
router.get('/:postId', [authentication], errForward(
    async (req, res) => {
        const postId = parseInt(req.params.postId)

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                _count: {
                    likes: true
                }
            },
        })

        if (!post) {
            return res.status(404).json({
                err: 'Could not like count for the post'
            })
        }

        return res.status(200).json({ msg: post._count.likes })
    }
))

// POST /like/:postId
router.get('/:postId', [authentication], errForward(
    async (req, res) => {
        const postId = parseInt(req.params.postId)
        const userId = req.locals.userId

        const like = await prisma.like.create({
            data: {
                postId: postId,
                userId: userId,
            },
            select: {
                id: true,
            }
        })

        if (!like) {
            return res.status(404).json({
                err: 'Could not like this post'
            })
        }

        return res.status(200).json({
            msg: 'Liked the post successfully',
        })
    }
))

// DELETE /like/:id
router.get('/:id', [authentication], errForward(
    async (req, res) => {
        const id = req.params.id

        const deletedLike = await prisma.like.delete({
            where: {
                id: id,
                userId: req.locals.userId,
            },
        })

        if (!deletedLike) {
            return res.status(404).json({
                err: 'Could not remove the like from this post'
            })
        }

        return res.status(200).json({
            msg: 'Removed like from this post successfully',
        })
    }
))

module.exports = router
