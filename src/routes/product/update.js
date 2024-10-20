const express = require('express');

const router = express.Router();

const {
    ProductUpdate,
} = require('../../controller/products/update');


/**
    *@openapi
    *'/productUpdate/ProductUpdate':
    *   patch:
    *      tags:
    *      - Products
    *      summary: update a product
    *      parameters:
    *        - in: body
    *          name: id
    *          required: true
    *          schema:
    *              type: string
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Server Error
*/
router.patch('/ProductUpdate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, product } = await ProductUpdate({ ...input }, { userInfo })

    res.status(status).json({ message, product });
})



module.exports = router;