const { User } = require('../../models/dbModels');

const { isAdmin, isWorkingPhoneValid, isPhoneValid } = require('../../lib/Functions');
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

        //check if there is a new password and it's valid
        if (password && password.length < 8) {
            return {
                message: "Password Should have more than 8 characters",
                token: null,
                status: 400
            }
        }

        //check if working phone is valid
        if (workingPhone && !isWorkingPhoneValid(workingPhone)) {
            return {
                message: "working phone is not valid",
                token: null,
                status: 400
            }
        }

        //check if phone is valid
        if (phone && !isPhoneValid(phone)) {
            return {
                message: "Phone is not valid",
                token: null,
                status: 400
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

        //check if username already exists
        if (username) {
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

        var hashedPassword;
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
            status: 205
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
    SellerUpdate
}