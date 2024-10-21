const express = require('express');

const router = express.Router();

const {
    ProvinceCreate
} = require('../../controller/province/post');


router.post('/ProvinceCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, province } = await ProvinceCreate({ ...input }, { userInfo });

    res.status(status).json({ message, province });
})




module.exports = router;