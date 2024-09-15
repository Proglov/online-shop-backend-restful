const express = require('express');

const router = express.Router();

const {
    getAllSubcategories,
    getOneSubcategory
} = require('../../controller/subcategory/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getAllSubcategories', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { subcategories, allSubcategoriesCount, status, message } = await getAllSubcategories(args, null)

    res.status(status).json({ subcategories, allSubcategoriesCount, message });
})

router.get('/getOneSubcategory', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { subcategory, status, message } = await getOneSubcategory(args, null)

    res.status(status).json({ subcategory, message });
})



module.exports = router;