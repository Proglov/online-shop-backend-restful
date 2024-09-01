const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const { CompanyCouponForSomeProducts, Product } = require('../../../models/dbModels');

const { isAdmin, getCoupon } = require('../../../lib/Functions');
const { verifyCompanyCouponForSomeProductsBody } = require('./serverActions');


const CompanyCouponForSomeProductsCreate = async (args, context) => {
    const {
        productsIds,
        offPercentage,
        minBuy,
        maxOffPrice,
        remainingCount
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                coupon: null,
                message: "You are not authorized!",
                status: 400
            }
        }

        const products = await Product.find({
            _id: {
                $in: productsIds
            }
        })

        if (products.length == 0) return {
            coupon: null,
            message: "at least one product is required",
            status: 400
        }
        const sellerId = products[0].sellerId

        if (!(await isAdmin(userInfo?.userId)) && !sellerId.equals(new mongoose.Types.ObjectId(userInfo?.userId))) {
            return {
                coupon: null,
                message: "You are not authorized!",
                status: 403
            }
        }
        for (let i = 0; i < products.length; i++) {
            if (!sellerId.equals(new mongoose.Types.ObjectId(products[i].sellerId))) return {
                coupon: null,
                message: "products belong to different sellers!",
                status: 400
            }
        }

        if (typeof offPercentage !== 'number' || typeof minBuy !== 'number' || typeof maxOffPrice !== 'number' || typeof remainingCount !== 'number') return {
            coupon: null,
            message: "offPercentage, minBuy, maxOffPrice, and remainingCount are required",
            status: 400
        }

        let body = getCoupon('CompanyCouponForSomeProducts')

        while (true) {
            const existingCoupon = await CompanyCouponForSomeProducts.findOne({ body })
            if (!existingCoupon)
                break;
            body = getCoupon('CompanyCouponForSomeProducts')
        }

        const newCompanyCouponForSomeProducts = new CompanyCouponForSomeProducts({
            productsIds,
            offPercentage,
            minBuy,
            maxOffPrice,
            remainingCount,
            body
        })

        newCompanyCouponForSomeProducts.save();

        return {
            coupon: newCompanyCouponForSomeProducts,
            message: "CompanyCouponForSomeProducts Has Been Created Successfully!",
            status: 201
        }

    } catch (error) {
        return {
            coupon: null,
            message: error,
            status: 500
        }
    }


}


const getTokenFromBodyCompanyCouponForSomeProducts = async (args, context) => {
    const { body } = args;
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) return {
            minBuy: null,
            maxOffPrice: null,
            offPercentage: null,
            productsIds: null,
            body: null,
            message: "You are not authorized!",
            status: 400
        }
        if (typeof body !== 'string') return {
            minBuy: null,
            maxOffPrice: null,
            offPercentage: null,
            productsIds: null,
            token: null,
            message: 'Body is required',
            status: 400
        }


        const { status, message, productsIds, maxOffPrice, minBuy, offPercentage } = await verifyCompanyCouponForSomeProductsBody({ body }, { userInfo })

        if (!status) return {
            minBuy: null,
            maxOffPrice: null,
            offPercentage: null,
            productsIds: null,
            token: null,
            message,
            status: 403
        }

        const token = await JWT.sign({
            userId: userInfo?.userId,
            body
        }, process.env.JWT_SIGNATURE, {
            expiresIn: 300
        })

        return {
            minBuy,
            maxOffPrice,
            offPercentage,
            productsIds,
            token,
            message: null,
            status: 200
        }
    } catch (error) {
        return {
            minBuy: null,
            maxOffPrice: null,
            offPercentage: null,
            productsIds: null,
            token: null,
            message: error,
            status: 500
        }
    }
}



module.exports = {
    CompanyCouponForSomeProductsCreate,
    getTokenFromBodyCompanyCouponForSomeProducts
}