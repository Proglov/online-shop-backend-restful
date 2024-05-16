const { Seller } = require('../../models/dbModels');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');


const { isWorkingPhoneValid, isEmailValid } = require('../../lib/Functions');

const SellerSignUp = async (args, _context) => {
    const {
        name,
        storeName,
        email,
        username,
        password,
        phone,
        address,
        bio
    } = args;

    try {
        if (!isWorkingPhoneValid(phone)) {
            return {
                message: "phone number is invalid!",
                token: null,
                status: 400
            }
        }
        if (!username || username?.length < 8) {
            return {
                message: "username is not valid",
                token: null,
                status: 400
            }
        }
        if (!password || password?.length < 8) {
            return {
                message: "password is not valid",
                token: null,
                status: 400
            }
        }
        if (!address || address?.length < 8) {
            return {
                message: "address is not valid",
                token: null,
                status: 400
            }
        }
        if (!bio || bio?.length < 8) {
            return {
                message: "bio is not valid",
                token: null,
                status: 400
            }
        }
        if (!storeName) {
            return {
                message: "storeName is not valid",
                token: null,
                status: 400
            }
        }
        if (!name) {
            return {
                message: "name is not valid",
                token: null,
                status: 400
            }
        }
        if (!isEmailValid(email)) {
            return {
                message: "email is not valid",
                token: null,
                status: 400
            }
        }

        const newSeller = new Seller({
            name,
            storeName,
            email,
            username,
            password,
            phone,
            address: [address],
            bio
        })

        await newSeller.save();

        const token = await JWT.sign({
            userId: newSeller.id
        }, process.env.JWT_SIGNATURE, {
            expiresIn: 86400
        })

        return {
            message: null,
            token,
            status: 201
        }


    } catch (error) {
        if (error?.errors?.phone?.name == "ValidatorError")
            return {
                message: 'this phone number already exists!',
                token: null,
                status: 500
            }
        return {
            message: error,
            token: null,
            status: 500
        }
    }



}

const SellerSignInWithPhone = async (args, _context) => {
    const { phone } = args;

    try {
        const seller = await Seller.findOne({
            phone
        })

        if (seller) {
            const token = await JWT.sign({
                userId: seller.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token,
                status: 200
            }
        }
        return {
            message: "no seller found",
            token: null,
            status: 401
        }


    } catch (error) {
        return {
            message: error,
            token: null,
            status: 500
        }
    }



}

const SellerSignInWithEmailOrUsername = async (args, _context) => {
    const { emailOrUsername, password } = args;

    try {
        const sellerWithEmail = await Seller.findOne({
            email: emailOrUsername
        })

        if (sellerWithEmail) {

            const isMatch = await bcrypt.compare(password, sellerWithEmail.password)

            if (!isMatch) throw new Error("Invalid Credentials")

            const token = await JWT.sign({
                sellerId: sellerWithEmail.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token,
                status: 200
            }
        }

        const sellerWithUsername = await User.findOne({
            username: emailOrUsername
        })

        if (sellerWithUsername) {

            const isMatch = await bcrypt.compare(password, sellerWithUsername.password)

            if (!isMatch) throw new Error("Invalid Credentials")

            const token = await JWT.sign({
                userId: sellerWithUsername.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token,
                status: 200
            }
        }
        return {
            message: "no seller found",
            token: null,
            status: 401
        }


    } catch (error) {
        return {
            message: error,
            token: null,
            status: 500
        }
    }

}


module.exports = {
    SellerSignUp,
    SellerSignInWithPhone,
    SellerSignInWithEmailOrUsername
}