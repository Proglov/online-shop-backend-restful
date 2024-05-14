const { User } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');

const getMe = async (_args, context) => {

    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                user: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        const user = await User.findById(userInfo?.userId).select('-password');
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
    let { id } = args;


    try {
        //check if req contains token
        if (!userInfo) {
            return {
                user: null,
                status: 400,
                message: "You Are Not Authorized"
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

        const user = await User.findById(id)

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
    let { page, perPage } = args;


    try {
        //check if req contains token
        if (!userInfo) {
            return {
                users: null,
                usersCount: 0,
                status: 400,
                message: "You Are Not Authorized"
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


        const usersCount = await User.where().countDocuments().exec();

        if (!page || !perPage) {
            const users = await User.find().select('-password');

            return {
                users,
                usersCount,
                status: 200,
                message: null
            }
        }

        page = parseInt(page);
        perPage = parseInt(perPage);
        const skip = (page - 1) * perPage;
        const users = await User.find().select('-password').skip(skip).limit(perPage);

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
        //check if req contains token
        if (!userInfo) {
            return {
                status: 400,
                isAdmin: null,
                message: 'you are not authorized'
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