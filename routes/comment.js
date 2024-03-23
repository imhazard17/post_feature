const express = require('express')
const router = express.Router()
const prisma = require('../utils/db')
const authentication = require('../middlewares/authentication')
const { commentInputValidation } = require('../middlewares/input_validation')
const errForward = require('../utils/errorForward')

// GET /comment/:postId (get all comments on a post)
router.get('/:postId', errForward(async (req, res) => {
    const postId = parseInt(req.params.postId)

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            comments: true,
        }
    })

    if (!post) {
        return res.status(404).json({
            err: 'Could not load comments for the post'
        })
    }

    return res.status(200).json({ msg: post.comments })
}))

// POST /comment/:postId
router.post('/:postId', [commentInputValidation, authentication], errForward(async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.locals.userId;

    const comment = await prisma.comment.create({
        data: {
            content: req.body.content,
            userId: userId,
            postId: postId,
        },
        select: {
            id: true
        }
    });

    if (!comment) {
        return res.status(404).json({
            err: 'Could not create comment'
        })
    }

    return res.status(200).json({
        msg: 'Comment created successfully'
    })
}))

// PUT /comment/:id
router.put('/:id', [authentication], errForward(async (req, res) => {
    const commentId = req.params.id;

    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId,
            userId: req.locals.userId,
        },
        data: {
            content: req.body.content,
        },
        select: {
            content: true
        }
    });

    if (!updatedComment) {
        return res.status(404).json({
            err: 'Could not update comment'
        })
    }

    return res.status(200).json({
        msg: `Comment update successfully to: ${updatedComment.content}`,
    })
}))

// DELETE /comment/:id
router.delete('/:id', [authentication], errForward(async (req, res) => {
    const commentId = req.params.id;

    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId,
            userId: req.locals.userId,
        }
    });

    if (!deletedComment) {
        return res.status(404).json({
            err: 'Could not update comment'
        })
    }

    return res.status(200).json({
        msg: 'Comment deleted successfully',
    })
}))

module.exports = router
