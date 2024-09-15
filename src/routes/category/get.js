const express = require('express');

const router = express.Router();

const {
    getAllCategories,
    getOneCategory
} = require('../../controller/category/get');


router.get('/getAllCategories', async (req, res) => {
    const args = req.query

    const { categories, allCategoriesCount, status, message } = await getAllCategories({ ...args }, null)

    res.status(status).send({ categories, allCategoriesCount, message });
})

router.get('/getOneCategory', async (req, res) => {
    const args = req.query

    const { category, status, message } = await getOneCategory({ ...args }, null)

    res.status(status).send({ category, message });
})



module.exports = router;