const express = require('express');

const router = express.Router();

const {
    FestivalCreate
} = require('../../controller/festivals/festival/post');


router.post('/FestivalCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message } = await FestivalCreate({ ...input }, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;