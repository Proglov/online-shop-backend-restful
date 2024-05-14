const express = require('express');

const router = express.Router();

const {
    CommentAdd
} = require('../../controller/comments/post');


router.post('/CommentAdd', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message } = await CommentAdd({ ...input }, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;