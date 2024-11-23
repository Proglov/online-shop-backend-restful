const express = require('express');
const {
    getAllProducts,
    getAllMyProducts,
    getAllProductsOfASeller,
    getOneProduct,
    getOneProductParams,
    getAllProductsOfACategory,
    getAllProductsOfASubcategory,
    getSomeProducts,
    getPopularProducts
} = require('../../controller/products/get');

const { setUserInfo } = require('../../lib/middlewares');
const { getQueryArgs } = require('../../lib/Functions');

const router = express.Router();

/**
    *@openapi
    *'/productGet/getAllProducts':
    *   get:
    *      tags:
    *      - Products
    *      summary: get All Products
    *      parameters:
    *        - in: query
    *          name: page
    *          required: false
    *          description: page number for pagination
    *          schema:
    *              type: integer
    *        - in: query
    *          name: perPage
    *          required: false
    *          description: items per page for pagination
    *          schema:
    *              type: integer
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Server Error
*/
router.get('/getAllProducts', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { products, allProductsCount, status, message } = await getAllProducts(args, null)

    res.status(status).json({ products, allProductsCount, message });
})

/**
    *@openapi
    *'/productGet/getAllMyProducts':
    *   get:
    *      tags:
    *      - Products
    *      summary: get All Products of an authorized Seller
    *      security:
    *        - ApiKeyAuth: []
    *      parameters:
    *        - in: query
    *          name: page
    *          required: false
    *          description: page number for pagination
    *          schema:
    *              type: integer
    *        - in: query
    *          name: perPage
    *          required: false
    *          description: items per page for pagination
    *          schema:
    *              type: integer
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       401:
    *           description: Unauthorized
    *       500:
    *           description: Unexpected Error
*/
router.get('/getAllMyProducts', setUserInfo, async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { products, allProductsCount, status, message } = await getAllMyProducts(args, { userInfo })

    res.status(status).json({ products, allProductsCount, message });
})

/**
    *@openapi
    *'/productGet/getAllProductsOfASeller':
    *   get:
    *      tags:
    *      - Products
    *      summary: get All Products of an authorized Seller with its ID
    *      security:
    *        - ApiKeyAuth: []
    *      parameters:
    *        - in: query
    *          name: id
    *          required: true
    *          description: id of the seller
    *          schema:
    *              type: string
    *        - in: query
    *          name: page
    *          required: false
    *          description: page number for pagination
    *          schema:
    *              type: integer
    *        - in: query
    *          name: perPage
    *          required: false
    *          description: items per page for pagination
    *          schema:
    *              type: integer
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       401:
    *           description: Unauthorized
    *       500:
    *           description: Unexpected Error
*/
router.get('/getAllProductsOfASeller', setUserInfo, async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { products, allProductsCount, status, message } = await getAllProductsOfASeller(args, { userInfo })

    res.status(status).json({ products, allProductsCount, message });
})

/**
    *@openapi
    *'/productGet/getOneProduct':
    *   get:
    *      tags:
    *      - Products
    *      summary: get One Products with its ID
    *      parameters:
    *        - in: query
    *          name: id
    *          required: true
    *          description: id of the product
    *          schema:
    *              type: string
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Unexpected Error
*/
router.get('/getOneProduct', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { product, status, message } = await getOneProduct(args, null)

    res.status(status).json({ product, message });
})

/**
    *@openapi
    *'/productGet/getOneProductParams':
    *   get:
    *      tags:
    *      - Products
    *      summary: Get Params of One Products with its ID. it includes the id of the category and the subcategory
    *      parameters:
    *        - in: query
    *          name: id
    *          required: true
    *          description: id of the product
    *          schema:
    *              type: string
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Unexpected Error
*/
router.get('/getOneProductParams', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { params, status, message } = await getOneProductParams(args, null)

    res.status(status).json({ params, message });
})

/**
    *@openapi
    *'/productGet/getSomeProducts':
    *   get:
    *      tags:
    *      - Products
    *      summary: Get Some Products with their IDs
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Unexpected Error
*/
router.get('/getSomeProducts', async (req, res) => {
    // i didn't use getQueryArgs for this one, but i used encodeURIComponent inside its controller
    const args = req.query

    const { products, status, message } = await getSomeProducts(args, null)

    res.status(status).json({ products, message });
})

/**
    *@openapi
    *'/productGet/getPopularProducts':
    *   get:
    *      tags:
    *      - Products
    *      summary: Get Popular Products
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Unexpected Error
*/
router.get('/getPopularProducts', async (_req, res) => {

    const { products, status, message } = await getPopularProducts(null, null)

    res.status(status).json({ products, message });
})

/**
    *@openapi
    *'/productGet/getAllProductsOfACategory':
    *   get:
    *      tags:
    *      - Products
    *      summary: get All Products of a category
    *      parameters:
    *        - in: query
    *          name: categoryId
    *          required: true
    *          description: id of the category
    *          schema:
    *              type: string
    *        - in: query
    *          name: page
    *          required: false
    *          description: page number for pagination
    *          schema:
    *              type: integer
    *        - in: query
    *          name: perPage
    *          required: false
    *          description: items per page for pagination
    *          schema:
    *              type: integer
    *        - in: cookie
    *          name: cityIds
    *          required: false
    *          description: ids of the cities . all cities are applied if not provided
    *          schema:
    *              type: string
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Unexpected Error
*/
router.get('/getAllProductsOfACategory', async (req, res) => {
    const args = getQueryArgs({ ...req.query, ...req.cookies }, {
        page: 'posInt',
        perPage: 'posInt',
        categoryId: 'string',
        cityIds: 'string'
    })

    const { products, status, message } = await getAllProductsOfACategory(args, null)

    res.status(status).json({ products, message });
})

/**
    *@openapi
    *'/productGet/getAllProductsOfASubcategory':
    *   get:
    *      tags:
    *      - Products
    *      summary: get All Products of a subcategory
    *      parameters:
    *        - in: query
    *          name: subcategoryId
    *          required: true
    *          description: id of the subcategory
    *          schema:
    *              type: string
    *        - in: query
    *          name: page
    *          required: false
    *          description: page number for pagination
    *          schema:
    *              type: integer
    *        - in: query
    *          name: perPage
    *          required: false
    *          description: items per page for pagination
    *          schema:
    *              type: integer
    *        - in: cookie
    *          name: cityIds
    *          required: false
    *          description: ids of the cities . all cities are applied if not provided
    *          schema:
    *              type: string
    *      responses:
    *       200:
    *           description: Fetched Successfully
    *       500:
    *           description: Unexpected Error
*/
router.get('/getAllProductsOfASubcategory', async (req, res) => {
    const args = getQueryArgs({ ...req.query, ...req.cookies }, {
        page: 'posInt',
        perPage: 'posInt',
        subcategoryId: 'string',
        cityIds: 'string'
    })

    const { products, status, message } = await getAllProductsOfASubcategory(args, null)

    res.status(status).json({ products, message });
})


module.exports = router;