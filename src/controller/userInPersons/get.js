const { UserInPerson } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const getAllUserInPersons = async (args, context) => {
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

        const query = UserInPerson.find({}).skip(skip).limit(perPage)

        let usersCount = 0
        const users = await query.lean().exec();

        if (!skip) usersCount = users.length
        else usersCount = await UserInPerson.where().countDocuments().exec();

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

//the function below, belongs to the sellers
const getAllMyUserInPersons = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage } = args;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                users: null,
                usersCount: 0,
                status: 400,
                message: "You Are Not Authorized"
            }
        }


        const skip = (page - 1) * perPage;
        const condition = { sellerId: userInfo?.userId }
        const query = UserInPerson.find(condition).skip(skip).limit(perPage).select('-sellerId')

        let usersCount = 0
        const users = await query.lean().exec();

        if (!skip) usersCount = users.length
        else usersCount = await UserInPerson.where().countDocuments().exec();

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



module.exports = {
    getAllUserInPersons,
    getAllMyUserInPersons
}