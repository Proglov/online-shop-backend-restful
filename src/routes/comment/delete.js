const express = require('express');

const router = express.Router();

const {
    CommentDelete
} = require('../../controller/comments/delete');


router.delete('/CommentDelete', async (req, res) => {
    const userInfo = req?.userInfo
    const { id } = req.body

    const { status, message, id: theId } = await CommentDelete({ id }, { userInfo });

    res.status(status).json({ message, id: theId });
})




module.exports = router;