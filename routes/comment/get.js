const express = require('express');

const router = express.Router();

const {
    getAllComments,
    getOneComment,
    getCommentsOfAProduct
} = require('../../controller/comments/get');


router.get('/getAllComments', async (req, res) => {

    const args = req.query

    const { status, comments, message, allCommentsCount } = await getAllComments(args, null)

    res.status(status).send({ comments, message, allCommentsCount });
})


router.get('/getOneComment', async (req, res) => {
    const args = req.query

    const { comment, status, message } = await getOneComment({ ...args }, null)

    res.status(status).send({ comment, message });
})


router.get('/getCommentsOfAProduct', async (req, res) => {
    const args = req.query

    const { comments, status, message } = await getCommentsOfAProduct({ ...args }, null)

    res.status(status).send({ comments, message });
})



module.exports = router;