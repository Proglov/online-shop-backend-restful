const { User } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');

const getMe = async (_args, context) => {

    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const user = await User.findById(userInfo?.userId).select('-password').lean().exec();

        return {
            user,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            user: null,
            status: 500,
            message: error
        }
    }

}

const getUser = async (args, context) => {
    const { userInfo } = context;
    const { id } = args;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        //only admin can get the users
        if (!(await isAdmin(userInfo.userId))) {
            return {
                user: null,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        const user = await User.findById(id).select('-password').lean().exec()

        return {
            user,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            user: null,
            status: 500,
            message: error
        }
    }

}

const getUsers = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage } = args;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        //only admin can get the users
        if (!(await isAdmin(userInfo.userId))) {
            return {
                users: null,
                usersCount: 0,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        const skip = (page - 1) * perPage;

        const query = User.find().select('-password').skip(skip).limit(perPage)

        let usersCount = 0
        const users = await query.lean().exec();

        if (!skip) usersCount = users.length
        else usersCount = await User.where().countDocuments().exec();

        return {
            users,
            usersCount,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            users: null,
            usersCount: 0,
            status: 500,
            message: error
        }
    }

}

const isUserAdmin = async (_args, context) => {
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const bool = await isAdmin(userInfo.userId)

        return {
            status: 200,
            isAdmin: bool,
            message: null
        }


    } catch (error) {
        return {
            status: 500,
            isAdmin: null,
            message: error
        }
    }

}


module.exports = {
    getMe,
    getUser,
    getUsers,
    isUserAdmin
}