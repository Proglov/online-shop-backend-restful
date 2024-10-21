const express = require('express');

const router = express.Router();

const {
    CityCreate
} = require('../../controller/city/post');


router.post('/CityCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, city } = await CityCreate({ ...input }, { userInfo });

    res.status(status).json({ message, city });
})




module.exports = router;