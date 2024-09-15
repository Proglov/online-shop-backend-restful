const express = require('express');

const router = express.Router();

const {
    getAllCategories,
    getOneCategory
} = require('../../controller/category/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getAllCategories', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { categories, allCategoriesCount, status, message } = await getAllCategories(args, null)

    res.status(status).json({ categories, allCategoriesCount, message });
})

router.get('/getOneCategory', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { category, status, message } = await getOneCategory(args, null)

    res.status(status).json({ category, message });
})



module.exports = router;