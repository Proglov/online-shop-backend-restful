const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const sharp = require('sharp');
const { Seller } = require("../../models/dbModels");
const { extractSellerIdFromFilename, isAdmin } = require("../../lib/Functions");

const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});


const updateImage = async (args, context) => {
    const { buffer, filename } = args
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                status: 403,
                message: "you are not authorized"
            }
        }

        const seller = await Seller.findById(userInfo?.userId)

        if (!(await isAdmin(userInfo?.userId)) && !seller && extractSellerIdFromFilename(filename) !== userInfo?.userId) {
            return {
                status: 403,
                message: "you are not authorized"
            }
        }

        // resize
        const newBuffer = await sharp(buffer).resize({ height: 600, width: 800, fit: "cover" }).toBuffer()

        const params = {
            Body: newBuffer,
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: filename,
        };
        await s3.send(new PutObjectCommand(params));
        return {
            status: 202,
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