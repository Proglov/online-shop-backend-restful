const express = require('express');

const router = express.Router();

const {
    CommentDelete
} = require('../../controller/comments/delete');


router.delete('/CommentDelete', async (req, res) => {
    const userInfo = req?.userInfo
    const { id } = req.body

    const { status, message } = await CommentDelete({ id }, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;