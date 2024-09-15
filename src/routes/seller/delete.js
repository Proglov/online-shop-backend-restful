const express = require('express');

const router = express.Router();

const {
    SellerDelete
} = require('../../controller/sellers/delete');


router.delete('/SellerDelete', async (req, res) => {
    const userInfo = req?.userInfo
    const { id } = req.body

    const { status, message, id: theId } = await SellerDelete({ id }, { userInfo });

    res.status(status).send({ message, id: theId });
})




module.exports = router;