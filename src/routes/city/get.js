const express = require('express');

const router = express.Router();

const {
    getAllCities,
    getOneCity
} = require('../../controller/city/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getAllCities', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { cities, allCitiesCount, status, message } = await getAllCities(args, null)

    res.status(status).json({ cities, allCitiesCount, message });
})

router.get('/getOneCity', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { city, status, message } = await getOneCity(args, null)

    res.status(status).json({ city, message });
})



module.exports = router;