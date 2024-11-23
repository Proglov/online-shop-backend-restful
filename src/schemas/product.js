
/**
    * @openapi
    * components:
    *   schemas:
    *       createProductInput:
    *       type: object
    *       required:
    *          - name
    *          - desc
    *          - price
    *          - subcategoryId
    *          - warehouseId
    *          - imagesUrl
    *          - count
    *       properties:
    *           name:
    *               type: string
    *           desc:
    *               type: string
    *           price:
    *               type: integer
    *           subcategoryId:
    *               type: string
    *           warehouseId:
    *               type: string
    *           imagesUrl:
    *               type: array
    *               items:
    *                   types: string
    *           count:
    *               type: string
*/
const postProductSchema = {
    name: {
        label: 'نام محصول',
        type: 'string',
        trim: true,
        max: 40,
        min: 3,
    },
    desc: {
        label: 'توضیحات محصول',
        type: 'string',
        trim: true,
        max: 100,
        min: 5,
    },
    price: {
        label: 'قیمت محصول',
        type: "number",
        positive: true,
        integer: true,
    },
    subcategoryId: {
        label: 'زیر دسته بندی محصول',
        type: 'string'
    },
    warehouseId: {
        label: 'انبار محصول',
        type: 'string'
    },
    imagesUrl: {
        label: 'تصاویر محصول',
        type: 'array',
        items: 'string',
        optional: true
    },
    count: {
        label: 'تعداد محصول',
        type: "number",
        positive: true,
        integer: true,
    }
}

const updateProductSchema = {
    id: {
        label: 'آیدی محصول',
        type: 'string',
    },
    name: {
        label: 'نام محصول',
        type: 'string',
        trim: true,
        max: 40,
        min: 3,
        optional: true
    },
    desc: {
        label: 'توضیحات محصول',
        type: 'string',
        trim: true,
        max: 100,
        min: 5,
        optional: true
    },
    price: {
        label: 'قیمت محصول',
        type: "number",
        positive: true,
        integer: true,
        optional: true
    },
    subcategoryId: {
        label: 'زیر دسته بندی محصول',
        type: 'string',
        optional: true
    },
    warehouseId: {
        label: 'انبار محصول',
        type: 'string',
        optional: true
    },
    imagesUrl: {
        label: 'تصاویر محصول',
        type: 'array',
        items: 'string',
        optional: true
    },
    addedCount: {
        label: 'تعداد محصول',
        type: "number",
        positive: true,
        integer: true,
        optional: true
    }
}



module.exports = {
    postProductSchema,
    updateProductSchema
}