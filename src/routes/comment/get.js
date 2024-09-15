const express = require('express');

const router = express.Router();

const {
    getAllComments,
    getOneComment,
    getCommentsOfAProduct,
    getCommentsOfAProductForSeller,
    getAllCommentsOfAUser
} = require('../../controller/comments/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getAllComments', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        validated: 'string'
    })

    const { status, comments, message, allCommentsCount } = await getAllComments(args, null)

    res.status(status).json({ comments, message, allCommentsCount });
})


router.get('/getOneComment', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { comment, status, message } = await getOneComment(args, null)

    res.status(status).json({ comment, message });
})


router.get('/getCommentsOfAProduct', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { comments, status, message } = await getCommentsOfAProduct(args, null)

    res.status(status).json({ comments, message });
})

router.get('/getCommentsOfAProductForSeller', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { comments, allCommentsCount, status, message } = await getCommentsOfAProductForSeller(args, null)

    res.status(status).json({ comments, allCommentsCount, message });
})


router.get('/getAllCommentsOfAUser', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { status, comments, message, allCommentsCount } = await getAllCommentsOfAUser(args, null)

    res.status(status).json({ comments, message, allCommentsCount });
})

module.exports = router;