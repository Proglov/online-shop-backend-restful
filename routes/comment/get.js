const express = require('express');

const router = express.Router();

const {
    getAllComments,
    getOneComment,
    getCommentsOfAProduct,
    getCommentsOfAProductForSeller,
    getAllCommentsOfAUser
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

router.get('/getCommentsOfAProductForSeller', async (req, res) => {
    const args = req.query

    const { comments, allCommentsCount, status, message } = await getCommentsOfAProductForSeller({ ...args }, null)

    res.status(status).send({ comments, allCommentsCount, message });
})


router.get('/getAllCommentsOfAUser', async (req, res) => {

    const args = req.query

    const { status, comments, message, allCommentsCount } = await getAllCommentsOfAUser(args, null)

    res.status(status).send({ comments, message, allCommentsCount });
})

module.exports = router;