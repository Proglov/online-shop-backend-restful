const { UserInPerson, Seller } = require('../../models/dbModels');

const UserInPersonCreate = async (args, context) => {
    const { userInfo } = context;
    const {
        phone,
        name
    } = args;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                user: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }


        const seller = await Seller.findById(userInfo?.userId)

        if (!seller) return {
            user: null,
            status: 400,
            message: "You Are Not Authorized"
        }

        //check if phone exists
        if (!!phone) {
            const existingUserByPhone = await UserInPerson.findOne({ phone, sellerId: seller._id });
            if (existingUserByPhone) {
                return {
                    user: null,
                    message: "Phone Already Exists",
                    status: 409
                }
            }
        }

        const newUser = new UserInPerson({
            phone,
            name,
            sellerId: seller._id
        })

        await newUser.save();

        return {
            user: {
                _id: newUser._id,
                name,
                phone
            },
            message: null,
            status: 201
        }

    } catch (error) {
        console.log(error);
        return {
            user: null,
            message: error,
            status: 500
        }
    }

}

module.exports = {
    UserInPersonCreate,
}