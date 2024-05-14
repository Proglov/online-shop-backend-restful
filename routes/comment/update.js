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

    res.status(status).send({ message });
})

router.patch('/CommentToggleLike', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await CommentToggleLike({ ...input }, { userInfo })

    res.status(status).send({ message });
})

router.patch('/CommentToggleDisLike', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await CommentToggleDisLike({ ...input }, { userInfo })

    res.status(status).send({ message });
})

router.patch('/CommentToggleValidate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await CommentToggleValidate({ ...input }, { userInfo })

    res.status(status).send({ message });
})



module.exports = router;