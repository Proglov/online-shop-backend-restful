const { User, Seller } = require('../../models/dbModels');
const { hash, compare } = require('bcryptjs');
const JWT = require('jsonwebtoken');


const { isPhoneValid } = require('../../lib/Functions');
const { postUserSchema } = require('../../schemas/user');
const { validator } = require('../../schemas/main');

const UserSignUp = async (args, _context) => {
    const {
        phone,
        username,
        password
    } = args;

    try {

        const check = validator(args, postUserSchema)

        if (check !== true) return {
            token: null,
            message: check[0].message,
            status: 400
        }

        if (!isPhoneValid(phone)) {
            return {
                message: "شماره همراه وارد شده معتبر نمیباشد",
                token: null,
                status: 400
            }
        }

        //check if phone exists
        const existingUserByPhone = await User.findOne({ phone });
        if (existingUserByPhone) {
            return {
                message: "شماره همراه قبلا ثبت نام شده",
                token: null,
                status: 409
            }
        }

        const existingSellerByPhone = await Seller.findOne({ phone });
        if (existingSellerByPhone) {
            return {
                message: "شماره همراه قبلا بعنوان فروشنده ثبت نام شده",
                token: null,
                status: 409
            }
        }

        //check if Username already exists
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
        return {
            message: error,
            token: null,
            status: 500
        }
    }
}

const UserSignInWithPhone = async (args, _context) => {
    const { phone, password } = args;

    try {
        const user = await User.findOne({ phone })

        if (!user) {
            return {
                message: 'شماره همراه و یا رمز عبور نادرست است',
                token: null,
                status: 401
            }

        }

        const isMatch = await compare(password, user.password)

        if (!isMatch) return {
            message: 'شماره همراه و یا رمز عبور نادرست است',
            token: null,
            status: 403
        }

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
                message: 'ایمیل، نام کاربری و یا رمز عبور نادرست است',
                token: null,
                status: 401
            }
        }
        const userWithEmail = await User.findOne({
            email: emailOrUsername
        })

        if (userWithEmail) {

            const isMatch = await compare(password, userWithEmail.password)

            if (!isMatch) return {
                message: 'ایمیل، نام کاربری و یا رمز عبور نادرست است',
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

            const isMatch = await compare(password, userWithUsername.password)

            if (!isMatch) return {
                message: 'ایمیل، نام کاربری و یا رمز عبور نادرست است',
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
            message: 'ایمیل، نام کاربری و یا رمز عبور نادرست است',
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