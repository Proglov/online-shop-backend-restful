const { User, Seller } = require('../../models/dbModels');
const JWT = require('jsonwebtoken');
const { isAdmin, isWorkingPhoneValid, isPhoneValid, isEmailValid } = require('../../lib/Functions');
const { hash } = require('bcryptjs');
const { error500, error401 } = require('../../lib/errors');


const SellerUpdate = async (args, context) => {
    const {
        id,
        name,
        storeName,
        email,
        username,
        password,
        phone,
        workingPhone,
        bio,
        officeAddress,
        warehouseAddresses
    } = args;
    const { userInfo } = context;

    try {

        //check if req contains token
        if (!userInfo) {
            return {
                error401,
                token: null
            }
        }

        //don't let the seller if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== id) {
            return {
                error401,
                token: null
            }
        }

        const seller = await Seller.findById(id);
        if (!seller) {
            return {
                message: "No seller found",
                token: null,
                status: 404
            }
        }

        //check if there is a new password and it's valid
        if (password && password.length < 8) {
            return {
                message: "Password Should have more than 8 characters",
                token: null,
                status: 400
            }
        }

        //check the working phone
        if (workingPhone && workingPhone !== seller.workingPhone) {
            if (!isWorkingPhoneValid(workingPhone)) {
                return {
                    message: "working phone is not valid",
                    token: null,
                    status: 400
                }
            }
            const existingSellerByWorkingPhone = await Seller.findOne({ workingPhone });

            if (existingSellerByWorkingPhone) {
                return {
                    message: "working phone Already Exists",
                    token: null,
                    status: 409
                }
            }
        }

        //check the phone
        if (phone && phone !== seller.phone) {
            if (!isPhoneValid(phone)) {
                return {
                    message: "Phone is not valid",
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

            const existingSellerByPhoneInUsers = await User.findOne({ phone });

            if (existingSellerByPhoneInUsers) {
                return {
                    message: "Phone Already Exists In Users",
                    token: null,
                    status: 409
                }
            }
        }

        //check if email is valid
        if (email && email !== seller.email) {
            if (!isEmailValid(email)) {
                return {
                    message: "Email is not valid",
                    token: null,
                    status: 400
                }
            }

            const existingSellerByEmail = await Seller.findOne({ email });

            if (existingSellerByEmail) {
                return {
                    message: "Email Already Exists",
                    token: null,
                    status: 409
                }
            }

            const existingSellerByEmailInUsers = await User.findOne({ email });

            if (existingSellerByEmailInUsers) {
                return {
                    message: "Email Already Exists In Users",
                    token: null,
                    status: 409
                }
            }
        }

        //check if username already exists
        if (username && username !== seller.username) {
            if (username?.length < 8) {
                return {
                    message: "username is not valid",
                    token: null,
                    status: 400
                }
            }
            const existingSeller = await Seller.findOne({ username });
            if (existingSeller) {
                return {
                    message: "username Already Exists",
                    token: null,
                    status: 409
                }
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return {
                    message: "username Already Exists",
                    token: null,
                    status: 409
                }
            }
        }

        if (!!officeAddress && (!officeAddress?.cityId || !officeAddress?.completeAddress)) {
            return {
                message: "officeAddress is not valid",
                token: null,
                status: 400
            }
        }
        if (!!warehouseAddresses && (warehouseAddresses?.length === 0)) {
            return {
                message: "warehouseAddresses is not valid",
                token: null,
                status: 400
            }
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await hash(password, 10);
        }

        const userObject = {};

        if (name) userObject.name = name;
        if (storeName) userObject.storeName = storeName;
        if (email) userObject.email = email;
        if (username) userObject.username = username;
        if (password) userObject.password = hashedPassword;
        if (phone) userObject.phone = phone;
        if (workingPhone) userObject.workingPhone = workingPhone;
        if (officeAddress) userObject.officeAddress = officeAddress;
        if (warehouseAddresses) userObject.warehouseAddresses = warehouseAddresses;
        if (bio) userObject.bio = bio;

        const updatedSeller = await Seller.findByIdAndUpdate(
            id,
            {
                $set: { ...userObject }
            }
        );

        const token = await JWT.sign({
            userId: updatedSeller.id
        }, process.env.JWT_SIGNATURE, {
            expiresIn: 86400
        })

        return {
            message: null,
            token,
            status: 202
        }

    } catch (error) {
        return {
            ...error500,
            token: null
        }
    }
}

const SellerValidate = async (args, context) => {
    const { id } = args;
    const { userInfo } = context;

    try {

        //check if req contains token
        if (!userInfo) {
            return {
                ...error401,
                seller: null
            }
        }

        //only admin can validate
        if (!(await isAdmin(userInfo?.userId))) {
            return {
                ...error401,
                seller: null
            }
        }

        const seller = await Seller.findById(id);
        if (!seller) {
            return {
                seller: null,
                message: "No seller found",
                status: 404
            }
        }


        if (!seller) {
            return {
                seller: null,
                message: 'Seller Not Found',
                status: 400
            }
        }

        seller.validated = !seller.validated

        // Save the updated seller with disLikes changes
        await seller.save();

        const sellerToReturn = { ...seller._doc }
        delete sellerToReturn.__v;
        delete sellerToReturn.password;
        return {
            seller: sellerToReturn,
            message: "Seller has been toggled validated Successfully",
            status: 200
        }


    } catch (error) {
        return {
            ...error500,
            seller: null
        }
    }
}

module.exports = {
    SellerUpdate,
    SellerValidate
}