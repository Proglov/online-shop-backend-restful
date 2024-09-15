const { Comment } = require('../../models/dbModels');

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
                id: null,
                message: "You Are Not Authorized",
                status: 400
            }
        }

        //only admin can Delete a comment
        if (!(await isAdmin(userInfo.userId))) {
            return {
                id: null,
                message: "You Are Not Authorized",
                status: 403
            }
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            return {
                id: null,
                message: "Comment not found",
                status: 400
            }
        }

        // Also delete the children comments
        if (deletedComment.validated) {
            await Comment.deleteMany({ parentCommentId: id });
        }

        return {
            id,
            message: "Comment has been Deleted Successfully",
            status: 200
        }

    } catch (error) {
        return {
            id: null,
            message: error,
            status: 500
        }
    }

}

module.exports = {
    CommentDelete
}