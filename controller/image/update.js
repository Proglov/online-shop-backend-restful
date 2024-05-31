const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const sharp = require('sharp');

const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});


const updateImage = async (args, _context) => {
    const { buffer, filename } = args

    try {
        // resize
        const newBuffer = await sharp(buffer).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer()

        const params = {
            Body: newBuffer,
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: filename,
        };
        await s3.send(new PutObjectCommand(params));
        return {
            status: 201,
            message: "Successfully Added",
            name: filename
        }
    } catch (error) {
        return {
            status: 500,
            message: error,
            name: null
        }
    }

}


module.exports = {
    updateImage
};