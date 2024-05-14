const express = require('express');

const router = express.Router();

const {
    getAllComments,
    getOneComment
} = require('../../controller/comments/get');


router.get('/getAllComments', async (req, res) => {

    const args = req.query

    const { status, comments, error, allCommentsCount } = await getAllComments(args, null)

    res.status(status).send({ comments, error, allCommentsCount });
})


router.get('/getOneComment', async (req, res) => {
    const args = req.query

    const { comment, status, error } = await getOneComment({ ...args }, null)

    res.status(status).send({ comment, error });
})



module.exports = router;