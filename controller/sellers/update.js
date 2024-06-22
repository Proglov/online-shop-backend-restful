const { User, Seller } = require('../../models/dbModels');
const JWT = require('jsonwebtoken');
const { isAdmin, isWorkingPhoneValid, isPhoneValid, isEmailValid } = require('../../lib/Functions');
const { hash } = require('bcryptjs');


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
        address,
        bio
    } = args;
    const { userInfo } = context;

    try {

        //check if req contains token
        if (!userInfo) {
            return {
                message: "You are not authorized!",
                token: null,
                status: 401
            }
        }

        //don't let the seller if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== id) {
            return {
                message: "You are not authorized!",
                token: null,
                status: 401
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
            if (!!isWorkingPhoneValid(workingPhone)) {
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
        if (email && !isEmailValid(email)) {
            return {
                message: "Email is not valid",
                token: null,
                status: 400
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
        }

        //check if email already exists
        if (email && email !== seller.email) {
            const existingSeller = await Seller.findOne({ email });
            if (existingSeller) {
                return {
                    message: "Email Already Exists",
                    token: null,
                    status: 409
                }
            }

            // ***********  check the email with sending a code    ************** \\
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
        if (address) userObject.address = address;
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
            message: error,
            token: null,
            status: 500
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
                seller: null,
                message: "You are not authorized!",
                status: 401
            }
        }

        //only admin can validate
        if (!(await isAdmin(userInfo?.userId))) {
            return {
                seller: null,
                message: "You are not authorized!",
                status: 401
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
            seller: null,
            message: error,
            status: 500
        }
    }

}

module.exports = {
    SellerUpdate,
    SellerValidate
}