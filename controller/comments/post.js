const { Comment } = require('../../models/dbModels');


const CommentAdd = async (args, context) => {
    const {
        body,
        parentCommentId,
        productId
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

        const newComment = await Comment({
            body,
            userId: userInfo.userId,
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