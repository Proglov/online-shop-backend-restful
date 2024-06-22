const express = require('express');

const router = express.Router();

const {
    TransActionDone
} = require('../../controller/transactions/update');


router.post('/TransActionDone', async (req, res) => {
    const userInfo = req?.userInfo
    const { id } = req.body

    const { status, message, transaction } = await TransActionDone({ id }, { userInfo });

    res.status(status).send({ message, transaction });
})


module.exports = router;