const express = require('express');

const router = express.Router();

const {
    ProductCreate
} = require('../../controller/products/post');


/**
    *@openapi
    *'/productPost/ProductCreate':
    *   post:
    *      tags:
    *      - Products
    *      summary: create a new product
    *      parameters:
    *        - in: body
    *          name: name
    *          required: true
    *          description: name of the product
    *          schema:
    *              type: string
    *        - in: body
    *          name: desc
    *          required: true
    *          description: description of the product
    *          schema:
    *              type: string
    *        - in: body
    *          name: sellerId
    *          required: true
    *          description: sellerId of the product
    *          schema:
    *              type: string
    *        - in: body
    *          name: subcategoryId
    *          required: true
    *          description: subcategoryId of the product
    *          schema:
    *              type: string
    *        - in: body
    *          name: price
    *          required: true
    *          description: name of the product
    *          schema:
    *              type: integer
    *        - in: body
    *          name: count
    *          required: true
    *          description: count of the product
    *          schema:
    *              type: integer
    *        - in: body
    *          name: imagesUrl
    *          required: false
    *          description: name of the product
    *          schema:
    *              type: array
    *              items:
    *                   type: string
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Unexpected Error
*/
router.post('/ProductCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, product } = await ProductCreate({ ...input }, { userInfo });

    res.status(status).json({ message, product });
})




module.exports = router;