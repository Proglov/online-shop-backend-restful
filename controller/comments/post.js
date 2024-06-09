const { Comment, User, Seller } = require('../../models/dbModels');


const CommentAdd = async (args, context) => {
    const {
        body,
        parentCommentId,
        productId,
        ownerType
    } = args;

    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You Are Not Authorized",
                status: 400
            }
        }

        if (!productId) {
            return {
                message: "productId is required!",
                status: 400
            }
        }

        if (!ownerType || (ownerType !== "User" && ownerType !== "Seller")) {
            return {
                message: "ownerType is required! it should be User or Seller",
                status: 400
            }
        }

        if (ownerType === "User") {
            const user = await User.findById(userInfo.userId).exec();

            if (!user) {
                return {
                    message: "no user found",
                    status: 400
                }
            }

        } else {
            const seller = await Seller.findById(userInfo.userId).exec();

            if (!seller) {
                return {
                    message: "no seller found",
                    status: 400
                }
            }
        }

        const newComment = await Comment({
            body,
            ownerType,
            ownerId: userInfo.userId,
            parentCommentId,
            productId
        })
        newComment.save();

        return {
            message: "Comment has been Added Successfully",
            status: 200
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }

}

module.exports = {
    CommentAdd
}