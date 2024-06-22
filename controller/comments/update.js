const mongoose = require('mongoose');
const { Comment, User, Seller } = require('../../models/dbModels');

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

        if (!id) {
            return {
                message: "Comment's id is required!",
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

        if (!ownerType || (ownerType !== "User" && ownerType !== "Seller")) {
            return {
                message: "ownerType is required. it should be User or Seller",
                status: 400
            }
        }

        if (ownerType === "User") {
            const user = await User.findById(userInfo.userId)
            if (!user) {
                return {
                    message: "You Are Not Authorized",
                    status: 400
                }
            }
        } else {
            const seller = await Seller.findById(userInfo.userId)
            if (!seller) {
                return {
                    message: "You Are Not Authorized",
                    status: 400
                }
            }
        }

        const objToFind = {
            id: new mongoose.Types.ObjectId(userInfo?.userId),
            type: ownerType
        };

        // Check if userId is already in the likes array
        const userIndex = comment.likes.findIndex(item => item.id.equals(objToFind.id))

        if (userIndex > -1) {
            // User already liked the comment, remove from likes array
            comment.likes.splice(userIndex, 1);
        } else {
            // User didn't like the comment, add to likes array
            comment.likes.push(objToFind);

            //if user used to dislike the comment, remove it
            const userIndexDis = comment.disLikes.findIndex(item => item.id.equals(objToFind.id))

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

        if (!id) {
            return {
                message: "Comment's id is required!",
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

        if (!ownerType || (ownerType !== "User" && ownerType !== "Seller")) {
            return {
                message: "ownerType is required. it should be User or Seller",
                status: 400
            }
        }

        if (ownerType === "User") {
            const user = await User.findById(userInfo.userId)
            if (!user) {
                return {
                    message: "You Are Not Authorized",
                    status: 400
                }
            }
        } else {
            const seller = await Seller.findById(userInfo.userId)
            if (!seller) {
                return {
                    message: "You Are Not Authorized",
                    status: 400
                }
            }
        }

        const objToFind = {
            id: new mongoose.Types.ObjectId(userInfo?.userId),
            type: ownerType
        };

        // Check if userId is already in the disLikes array
        const userIndex = comment.disLikes.findIndex(item => item.id.equals(objToFind.id))

        if (userIndex > -1) {
            // User already liked the comment, remove from disLikes array
            comment.disLikes.splice(userIndex, 1);
        } else {
            // User didn't like the comment, add to disLikes array
            comment.disLikes.push(objToFind);

            //if user used to like the comment, remove it
            const userIndexLike = comment.likes.findIndex(item => item.id.equals(objToFind.id))

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
                comment: null,
                message: "You Are Not Authorized",
                status: 400
            }
        }

        //only admin can toggle validated a comment
        if (!(await isAdmin(userInfo.userId))) {
            return {
                comment: null,
                message: "You Are Not Authorized",
                status: 403
            }
        }

        // Find the comment by commentId
        const comment = await Comment.findById(id).populate({ path: "ownerId", select: 'name' });

        if (!comment) {
            return {
                comment: null,
                message: 'Comment Not Found',
                status: 400
            }
        }

        comment.validated = !comment.validated

        // Save the updated comment with disLikes changes
        await comment.save();

        const commentToReturn = { ...comment._doc }
        delete commentToReturn.__v;

        return {
            comment: commentToReturn,
            message: "Comment has been toggled validated Successfully",
            status: 200
        }

    } catch (error) {
        return {
            comment: null,
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