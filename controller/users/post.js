const { User } = require('../../models/dbModels');
const { hash } = require('bcryptjs');
const JWT = require('jsonwebtoken');


const { isPhoneValid } = require('../../lib/Functions');

const UserSignUp = async (args, _context) => {
    const {
        phone,
        username,
        password
    } = args;

    try {
        if (!isPhoneValid(phone)) {
            return {
                message: "phone number is invalid!",
                token: null,
                status: 400
            }
        }

        //check if there is a new password and it's valid
        if (!password || password.length < 8) {
            return {
                message: "Password Should have more than 8 characters",
                token: null,
                status: 400
            }
        }

        //check if phone exists
        const existingUserByPhone = await User.findOne({ phone });

        if (existingUserByPhone) {
            return {
                message: "Phone Already Exists",
                token: null,
                status: 409
            }
        }

        //check if username is valid
        if (!username || username?.length < 8) {
            return {
                message: "username is not valid",
                token: null,
                status: 400
            }
        }

        //check if Username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return {
                message: "Username Already Exists",
                token: null,
                status: 409
            }
        }

        var hashedPassword;
        hashedPassword = await hash(password, 10);

        const newUser = new User({
            phone,
            username,
            password: hashedPassword
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