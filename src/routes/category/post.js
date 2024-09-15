const express = require('express');

const router = express.Router();

const {
    CategoryCreate
} = require('../../controller/category/post');


router.post('/CategoryCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, category } = await CategoryCreate({ ...input }, { userInfo });

    res.status(status).json({ message, category });
})




module.exports = router;