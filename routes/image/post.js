const express = require('express');
const multer = require('multer');

const router = express.Router();

// const {
// } = require('../../controller/users/get');

const storage = multer.memoryStorage();
const upload = multer({ storage })

// router.get('/getMe', async (req, res) => {
//     const userInfo = req?.userInfo

//     const { status, user, message } = await getMe(null, { userInfo })

//     res.status(status).send({ user, message });
// })


router.post('/uploadImages', upload.single('images'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
})


module.exports = router;