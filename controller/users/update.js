const { User, Seller } = require('../../models/dbModels');

const { isAdmin, isEmailValid, isPhoneValid } = require('../../lib/Functions');
const { hash } = require('bcryptjs');
const JWT = require('jsonwebtoken');


const UserUpdate = async (args, context) => {
    const {
        id,
        name,
        email,
        username,
        password,
        address,
        phone
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

        //don't let the user if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== id) {
            return {
                message: "You are not authorized!",
                token: null,
                status: 401
            }
        }

        const user = await User.findById(id);

        //check if there is a new password and it's valid
        if (password && password.length < 8) {
            return {
                message: "Password Should have more than 8 characters",
                token: null,
                status: 400
            }
        }

        //check the phone
        if (phone && phone !== user.phone) {
            if (!isPhoneValid(phone)) {
                return {
                    message: "Phone is not valid",
                    token: null,
                    status: 400
                }
            }
            const existingUser = await User.findOne({ phone });

            if (existingUser) {
                return {
                    message: "Phone Already Exists",
                    token: null,
                    status: 409
                }
            }

            const existingSeller = await Seller.findOne({ phone });


            if (existingSeller) {
                return {
                    message: "Phone Already Exists in the Sellers",
                    token: null,
                    status: 409
                }
            }
        }

        //check if email is valid
        if (email && email !== user.email) {
            if (!isEmailValid(email)) {
                return {
                    message: "Email is not valid",
                    token: null,
                    status: 400
                }
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return {
                    message: "Email Already Exists",
                    token: null,
                    status: 409
                }
            }

            const existingSeller = await Seller.findOne({ email });
            if (existingSeller) {
                return {
                    message: "Email Already Exists",
                    token: null,
                    status: 409
                }
            }
        }

        //check if Username already exists
        if (username && username !== user.username) {
            if (username?.length < 8) return {
                message: "username is not valid",
                token: null,
                status: 400
            }

            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername) {
                return {
                    message: "Username Already Exists",
                    token: null,
                    status: 409
                }
            }

            const existingSellerByUsername = await Seller.findOne({ username });
            if (existingSellerByUsername) {
                return {
                    message: "Username Already Exists",
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
        if (email) userObject.email = email;
        if (username) userObject.username = username;
        if (password) userObject.password = hashedPassword;
        if (phone) userObject.phone = phone;
        if (address) userObject.address = address;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: { ...userObject }
            }
        );

        const token = await JWT.sign({
            userId: updatedUser.id
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

module.exports = {
    UserUpdate
}