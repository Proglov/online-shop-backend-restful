const express = require('express');
const multer = require('multer');

const {
    uploadImages
} = require('../../controller/image/post');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage })



router.post('/uploadImages', upload.single('images'), async (req, res) => {

    try {

        const args = {
            buffer: req.file?.buffer,
            mimetype: req.file?.mimetype
        }

        const { status, message, name } = await uploadImages({ ...args }, null);

        res.status(status).send({ message, name });
    } catch (error) {
        res.status(500).send({ message: error, name: null });
    }

})


module.exports = router;