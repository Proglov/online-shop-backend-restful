const { User } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');

const UserDelete = async (args, context) => {
    const { id } = args;
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                message: "You are not authorized!",
                status: 401
            }
        }

        //don't let the user if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId))) {
            return {
                message: "You are not authorized!",
                status: 401
            }
        }

        const user = await User.findByIdAndDelete(id)

        return {
            message: `User ${user.id} has been deleted`,
            status: 202
        }


    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }



}


module.exports = {
    UserDelete
}