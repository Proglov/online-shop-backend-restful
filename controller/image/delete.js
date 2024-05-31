const { S3Client, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const { Seller } = require("../../models/dbModels");
require("dotenv").config();
const { extractSellerIdFromFilename, isAdmin } = require('../../lib/Functions');


const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});


const deleteImage = async (args, context) => {
    const { filename } = args
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

        const params = {
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: filename,
        };
        await s3.send(new DeleteObjectCommand(params));
        return {
            status: 201,
            message: "Successfully Deleted"
        }
    } catch (error) {
        return {
            status: 500,
            message: error
        }
    }

}

const deleteImages = async (args, context) => {
    const { filenames } = args
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                status: 403,
                message: "you are not authorized"
            }
        }

        for (const filename of filenames) {
            if (extractSellerIdFromFilename(filename) !== userInfo?.userId) {
                return {
                    status: 403,
                    message: "you are not authorized"
                }
            }
        }

        const seller = await Seller.findById(userInfo?.userId)

        if (!(await isAdmin(userInfo?.userId)) && !seller) {
            return {
                status: 403,
                message: "you are not authorized"
            }
        }
        const files2Delete = [];
        for (const filename of filenames) {
            files2Delete.push({
                "Key": filename
            })
        }
        const params = {
            "Bucket": process.env.LIARA_BUCKET_NAME,
            "Delete": {
                "Objects": files2Delete
            },
        };
        await s3.send(new DeleteObjectsCommand(params));
        return {
            status: 201,
            message: "Successfully Deleted"
        }
    } catch (error) {
        return {
            status: 500,
            message: error,
        }
    }

}


module.exports = {
    deleteImages,
    deleteImage
};