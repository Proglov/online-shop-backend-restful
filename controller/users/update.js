const { User } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');
const { hash } = require('bcryptjs');


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
        if (phone) {
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
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return {
                    message: "Email Already Exists",
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
    UserUpdate
}