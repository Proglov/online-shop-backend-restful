const { Seller, User } = require('../../models/dbModels');
const { hash, compare } = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { isWorkingPhoneValid, isEmailValid, isPhoneValid } = require('../../lib/Functions');
const { error500 } = require('../../lib/errors');



const SellerSignUp = async (args, _context) => {
    const {
        name,
        storeName,
        email,
        username,
        password,
        phone,
        workingPhone,
        bio,
        officeAddress
    } = args;

    try {
        if (!isWorkingPhoneValid(workingPhone)) {
            return {
                message: "working phone number is invalid!",
                token: null,
                status: 400
            }
        }
        if (!isPhoneValid(phone)) {
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
        if (!officeAddress || !officeAddress?.cityId || !officeAddress?.completeAddress) {
            return {
                message: "officeAddress is required",
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

        const existingSellerByPhone = await Seller.findOne({ phone });

        if (existingSellerByPhone) {
            return {
                message: "Phone Already Exists",
                token: null,
                status: 409
            }
        }

        const existingUserByPhone = await User.findOne({ phone });

        if (existingUserByPhone) {
            return {
                message: "Phone Already Exists In Users",
                token: null,
                status: 409
            }
        }

        const existingSellerByWorkingPhone = await Seller.findOne({ workingPhone });

        if (existingSellerByWorkingPhone) {
            return {
                message: "Working Phone Already Exists",
                token: null,
                status: 409
            }
        }

        const existingSellerByUsername = await Seller.findOne({ username });

        if (existingSellerByUsername) {
            return {
                message: "username Already Exists",
                token: null,
                status: 409
            }
        }

        const existingUserByUsername = await User.findOne({ username });

        if (existingUserByUsername) {
            return {
                message: "username Already Exists in users",
                token: null,
                status: 409
            }
        }

        var hashedPassword;
        if (password) {
            hashedPassword = await hash(password, 10);
        }

        const newSeller = new Seller({
            name,
            storeName,
            workingPhone,
            email,
            username,
            password: hashedPassword,
            phone,
            officeAddress,
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
            ...error500,
            token: null,
        }
    }
}

const SellerSignInWithPhone = async (args, _context) => {
    const { phone, password } = args;

    try {
        const seller = await Seller.findOne({
            phone
        })

        if (!seller) {
            return {
                message: "no seller found",
                token: null,
                status: 401
            }

        }

        const isMatch = await compare(password, seller.password)

        if (!isMatch) return {
            message: "Invalid Credentials",
            token: null,
            status: 403
        }

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
        if (!emailOrUsername || !password) {
            return {
                message: "Invalid Credentials",
                token: null,
                status: 401
            }
        }
        const sellerWithEmail = await Seller.findOne({
            email: emailOrUsername
        })

        if (sellerWithEmail) {

            const isMatch = await compare(password, sellerWithEmail.password)

            if (!isMatch) return {
                message: "Invalid Credentials",
                token: null,
                status: 401
            }

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

        const sellerWithUsername = await Seller.findOne({
            username: emailOrUsername
        })

        if (sellerWithUsername) {
            const isMatch = await compare(password, sellerWithUsername.password)

            if (!isMatch) return {
                message: "Invalid Credentials",
                token: null,
                status: 401
            }

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