const express = require('express');

const router = express.Router();

const {
    TransActionCreate
} = require('../../controller/transactions/post');


router.post('/TransActionCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, transactionId } = await TransActionCreate({ ...input }, { userInfo });

    res.status(status).send({ message, transactionId });
})


module.exports = router;