const { Comment } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const CommentUpdate = async (args, context) => {
    const {
        id,
        body,
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

        //only admin can update a comment
        if (!(await isAdmin(userInfo.userId))) {
            return {
                message: "You Are Not Authorized",
                status: 403
            }
        }

        //body is required
        if (!body) {
            return {
                message: "body is required",
                status: 400
            }
        }

        await Comment.findByIdAndUpdate(
            id,
            {
                $set: {
                    body,
                }
            },
            { new: true }
        )

        return {
            message: "Comment has been Updated Successfully",
            status: 202
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }

}

const CommentToggleLike = async (args, context) => {
    const {
        id,
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

        // Find the comment by commentId
        const comment = await Comment.findById(id);

        if (!comment) {
            return {
                message: "Comment Not Found",
                status: 400
            }
        }

        // Check if userId is already in the likes array
        const userIndex = comment.likes.indexOf(userInfo?.userId);

        if (userIndex > -1) {
            // User already liked the comment, remove from likes array
            comment.likes.splice(userIndex, 1);
        } else {
            // User didn't like the comment, add to likes array
            comment.likes.push(userInfo?.userId);

            //if user used to dislike the comment, remove it
            const userIndexDis = comment.disLikes.indexOf(userInfo?.userId);

            if (userIndexDis > -1) {
                comment.disLikes.splice(userIndexDis, 1);
            }
        }

        // Save the updated comment with likes changes
        await comment.save();

        return {
            message: "Comment has been toggled like Successfully",
            status: 200
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }

}

const CommentToggleDisLike = async (args, context) => {
    const {
        id,
    } = args;

    const { userInfo } = context

    try {
        //check for Authorization
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You Are Not Authorized",
                status: false
            }
        }

        // Find the comment by commentId
        const comment = await Comment.findById(id);

        if (!comment) {
            return {
                message: 'Comment Not Found',
                status: false
            }
        }

        // Check if userId is already in the disLikes array
        const userIndex = comment.disLikes.indexOf(userInfo?.userId);

        if (userIndex > -1) {
            // User already liked the comment, remove from disLikes array
            comment.disLikes.splice(userIndex, 1);
        } else {
            // User didn't dislike the comment, add to disLikes array
            comment.disLikes.push(userInfo?.userId);

            //if user used to like the comment, remove it
            const userIndexLike = comment.likes.indexOf(userInfo?.userId);

            if (userIndexLike > -1) {
                comment.likes.splice(userIndexLike, 1);
            }
        }

        // Save the updated comment with disLikes changes
        await comment.save();

        return {
            message: "Comment has been toggled disLike Successfully",
            status: 200
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }

}

const CommentToggleValidate = async (args, context) => {
    const {
        id,
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

        //only admin can toggle validated a comment
        if (!(await isAdmin(userInfo.userId))) {
            return {
                message: "You Are Not Authorized",
                status: 403
            }
        }

        // Find the comment by commentId
        const comment = await Comment.findById(id);

        if (!comment) {
            return {
                message: 'Comment Not Found',
                status: 400
            }
        }

        comment.validated = !comment.validated

        // Save the updated comment with disLikes changes
        await comment.save();

        return {
            message: "Comment has been toggled validated Successfully",
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
    CommentUpdate,
    CommentToggleLike,
    CommentToggleDisLike,
    CommentToggleValidate
}