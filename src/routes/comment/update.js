const express = require('express');

const router = express.Router();

const {
    CommentUpdate,
    CommentToggleLike,
    CommentToggleDisLike,
    CommentToggleValidate
} = require('../../controller/comments/update');


router.patch('/CommentUpdate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await CommentUpdate({ ...input }, { userInfo })

    res.status(status).json({ message });
})

router.patch('/CommentToggleLike', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, comment } = await CommentToggleLike({ ...input }, { userInfo })

    res.status(status).json({ message, comment });
})

router.patch('/CommentToggleDisLike', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, comment } = await CommentToggleDisLike({ ...input }, { userInfo })

    res.status(status).json({ message, comment });
})

router.patch('/CommentToggleValidate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, comment } = await CommentToggleValidate({ ...input }, { userInfo })

    res.status(status).json({ message, comment });
})



module.exports = router;