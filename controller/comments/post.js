const { Comment, Product } = require('../../models/dbModels');


const CommentAdd = async (args, context) => {
    const {
        body,
        parentCommentId,
        parentProductId
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

        const newComment = await Comment({
            body,
            userId: userInfo.userId,
            parentCommentId
        })


        if (parentProductId) {
            const product = await Product.findById(parentProductId);
            if (product) {
                newComment.save();
                product.commentsIds.push(newComment.id);
                product.save();
                return {
                    message: "Comment has been Added Successfully",
                    status: 200
                }
            }
        }

        return {
            message: "Comment is NOT added due to bad request",
            status: 400
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