const { UserInPerson } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const getAllUserInPersons = async (args, context) => {

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


        const usersCount = await UserInPerson.where().countDocuments().exec();

        if (!page || !perPage) {
            const users = await UserInPerson.find();

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
        const users = await UserInPerson.find().skip(skip).limit(perPage);

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
    let { page, perPage } = args;

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


        const usersCount = await UserInPerson.where({ sellerId: userInfo?.userId }).countDocuments().exec();

        if (!page || !perPage) {
            const users = await UserInPerson.find({ sellerId: userInfo?.userId }).select('-sellerId')

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
        const users = await UserInPerson.find({ sellerId: userInfo?.userId }).skip(skip).limit(perPage).select('-sellerId')

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