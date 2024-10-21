const express = require('express');

const router = express.Router();

const {
    getAllProvinces,
    getOneProvince
} = require('../../controller/province/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getAllProvinces', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { provinces, allProvincesCount, status, message } = await getAllProvinces(args, null)

    res.status(status).json({ provinces, allProvincesCount, message });
})

router.get('/getOneProvince', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { province, status, message } = await getOneProvince(args, null)

    res.status(status).json({ province, message });
})



module.exports = router;