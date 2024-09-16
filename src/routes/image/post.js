const express = require('express');
const multer = require('multer');

const {
    uploadImage
} = require('../../controller/image/post');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage })



router.post('/uploadImage', upload.single('images'), async (req, res) => {

    try {

        const userInfo = req?.userInfo

        const args = {
            buffer: req.file?.buffer,
            mimetype: req.file?.mimetype
        }

        const { status, message, name } = await uploadImage({ ...args }, { userInfo });

        res.status(status).json({ message, name });
    } catch (error) {
        res.status(500).json({ message: error, name: null });
    }

})


module.exports = router;