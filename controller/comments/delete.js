const { Product, Comment } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const CommentDelete = async (args, context) => {
    const {
        id
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

        //only admin can Delete a comment
        if (!(await isAdmin(userInfo.userId))) {
            return {
                message: "You Are Not Authorized",
                status: 403
            }
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        if (deletedComment) {
            // Also delete the children comments
            if (deletedComment.validated) {
                await Comment.deleteMany({ parentCommentId: id });
            }

            //also delete from product comments
            await Product.findOneAndUpdate(
                { commentsIds: { $in: [id] } },
                { $pull: { commentsIds: { $in: [id] } } },
                { new: true }
            );

            return {
                message: "Comment has been Deleted Successfully",
                status: 200
            }
        }

        return {
            message: "Comment not found",
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
    CommentDelete
}