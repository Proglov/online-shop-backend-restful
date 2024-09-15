const express = require('express');

const router = express.Router();

const {
    getAllSubcategories,
    getOneSubcategory
} = require('../../controller/subcategory/get');


router.get('/getAllSubcategories', async (req, res) => {
    const args = req.query

    const { subcategories, allSubcategoriesCount, status, message } = await getAllSubcategories({ ...args }, null)

    res.status(status).send({ subcategories, allSubcategoriesCount, message });
})

router.get('/getOneSubcategory', async (req, res) => {
    const args = req.query

    const { subcategory, status, message } = await getOneSubcategory({ ...args }, null)

    res.status(status).send({ subcategory, message });
})



module.exports = router;