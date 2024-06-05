const express = require('express');

const router = express.Router();

const {
    SubcategoryCreate
} = require('../../controller/subcategory/post');


router.post('/SubcategoryCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await SubcategoryCreate({ ...input }, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;