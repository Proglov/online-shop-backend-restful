const { User } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');

const UserDelete = async (_parent, args, context) => {
    const { id } = args;

    const { User } = context.db
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        //don't let the user if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId))) {
            throw new Error("You are not authorized!")
        }

        const user = await User.findByIdAndDelete(id)

        return {
            message: `User ${user.id} has been deleted`,
            status: true
        }


    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }



}


module.exports = {
    UserDelete
}