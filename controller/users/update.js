const { User } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const UserUpdate = async (_parent, args, context) => {
    const {
        id,
        name,
        email,
        username,
        password,
        address,
        phone
    } = args.input;
    const { User } = context.db;
    const { userInfo } = context;

    try {

        //check if req contains token
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        //don't let the user if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== id) {
            throw new Error("You are not authorized!")
        }

        const user = await User.findById(id);

        //check if there is a new password and it's valid
        if (password && password !== user.password && password.length < 8) {
            throw new Error("Password Should have more than 8 characters")
        }

        //check if phone is valid
        if (phone && !isPhoneValid(phone)) {
            throw new Error("Phone is not valid")
        }

        //check if email is valid
        if (email && !isEmailValid(email)) {
            throw new Error("Email is not valid")
        }

        //check if email already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email Already Exists")
            }
        }


        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    email,
                    username,
                    password,
                    address,
                    phone
                }
            },
            { new: true }
        );

        const token = await JWT.sign({
            userId: updatedUser.id
        }, process.env.JWT_SIGNATURE, {
            expiresIn: 86400
        })

        return {
            message: null,
            token
        }


    } catch (error) {
        return {
            message: error.message,
            User: null
        }
    }



}

module.exports = {
    UserUpdate
}