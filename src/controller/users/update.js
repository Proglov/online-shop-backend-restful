const { User, Seller } = require('../../models/dbModels');

const { isAdmin, isPhoneValid } = require('../../lib/Functions');
const { hash } = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { validator } = require('../../schemas/main');
const { updateUserSchema } = require('../../schemas/user');


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

        const check = validator(args, updateUserSchema)

        if (check !== true) return {
            token: null,
            message: check[0].message,
            status: 400
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

        //check the phone
        if (phone && phone !== user.phone) {
            if (!isPhoneValid(phone)) {
                return {
                    message: "شماره همراه معتبر نیست",
                    token: null,
                    status: 400
                }
            }
            const existingUser = await User.findOne({ phone });

            if (existingUser) {
                return {
                    message: "این شماره قبلا ثبت نام شده است",
                    token: null,
                    status: 409
                }
            }

            const existingSeller = await Seller.findOne({ phone });


            if (existingSeller) {
                return {
                    message: "این شماره قبلا ثبت نام شده است",
                    token: null,
                    status: 409
                }
            }
        }

        //check if email is valid
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return {
                    message: "این ایمیل قبلا ثبت نام شده است",
                    token: null,
                    status: 409
                }
            }

            const existingSeller = await Seller.findOne({ email });
            if (existingSeller) {
                return {
                    message: "این ایمیل قبلا ثبت نام شده است",
                    token: null,
                    status: 409
                }
            }
        }

        //check if Username already exists
        if (username && username !== user.username) {
            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername) {
                return {
                    message: "نام کاربری معتبر نمیباشد",
                    token: null,
                    status: 409
                }
            }

            const existingSellerByUsername = await Seller.findOne({ username });
            if (existingSellerByUsername) {
                return {
                    message: "نام کاربری معتبر نمیباشد",
                    token: null,
                    status: 409
                }
            }
        }


        let hashedPassword;
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