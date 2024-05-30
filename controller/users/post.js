const { User } = require('../../models/dbModels');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');


const { isPhoneValid } = require('../../lib/Functions');

const UserSignUp = async (args, _context) => {
    const { phone } = args;

    try {
        if (isPhoneValid(phone)) {
            const newUser = new User({
                phone
            })

            await newUser.save();

            const token = await JWT.sign({
                userId: newUser.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token,
                status: 201
            }
        }
        return {
            message: "phone number is invalid!",
            token: null,
            status: 400
        }


    } catch (error) {
        if (error?.errors?.phone?.name == "ValidatorError")
            return {
                message: 'this phone number already exists!',
                token: null,
                status: 401
            }
        return {
            message: error,
            token: null,
            status: 500
        }
    }



}

const UserSignInWithPhone = async (args, _context) => {
    const { phone } = args;

    try {
        const user = await User.findOne({
            phone
        })

        if (user) {
            const token = await JWT.sign({
                userId: user.id
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
            message: "no user found",
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

const UserSignInWithEmailOrUsername = async (args, _context) => {
    const { emailOrUsername, password } = args;

    try {
        if (!emailOrUsername || !password) {
            return {
                message: "Invalid Credentials",
                token: null,
                status: 401
            }
        }
        const userWithEmail = await User.findOne({
            email: emailOrUsername
        })

        if (userWithEmail) {

            const isMatch = await bcrypt.compare(password, userWithEmail.password)

            if (!isMatch) return {
                message: "Invalid Credentials",
                token: null,
                status: 401
            }

            const token = await JWT.sign({
                userId: userWithEmail.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token,
                status: 200
            }
        }

        const userWithUsername = await User.findOne({
            username: emailOrUsername
        })

        if (userWithUsername) {

            const isMatch = await bcrypt.compare(password, userWithUsername.password)

            if (!isMatch) return {
                message: "Invalid Credentials",
                token: null,
                status: 401
            }

            const token = await JWT.sign({
                userId: userWithUsername.id
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
            message: "no user found",
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
    UserSignUp,
    UserSignInWithPhone,
    UserSignInWithEmailOrUsername
}