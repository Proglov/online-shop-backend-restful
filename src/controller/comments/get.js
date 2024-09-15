const { Comment } = require('../../models/dbModels');


const getAllComments = async (args, _context) => {
    const { page, perPage, validated } = args;

    try {
        const condition = {}
        const skip = (page - 1) * perPage;

        if (!!validated && validated === "true") condition.validated = true
        else if (!!validated && validated === "false") condition.validated = false

        const query = Comment.find(condition).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage)

        let allCommentsCount = 0
        const comments = await query.lean().exec();

        if (!skip) allCommentsCount = comments.length
        else allCommentsCount = await Comment.where(condition).countDocuments().exec();

        return {
            comments,
            allCommentsCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            comments: null,
            allCommentsCount: 0,
            status: 500,
            message: error
        }
    }

}

const getOneComment = async (args, _context) => {
    const { id } = args;
    if (!id) {
        return {
            comment: null,
            message: "comment ID is required",
            status: 400,
        };
    }
    try {
        const comment = await Comment.findById(id).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").lean().exec();
        return {
            comment,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            comment: null,
            status: 500,
            message: error
        }
    }
}

const getCommentsOfAProduct = async (args, _context) => {
    const { page, perPage, id } = args;
    if (!id) return {
        comments: [],
        status: 400,
        message: 'id is required'
    }

    try {
        const skip = (page - 1) * perPage;
        const condition = { productId: id, validated: true }
        const query = Comment.find(condition).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage)

        const comments = await query.lean().exec();

        return {
            comments,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            comments: [],
            status: 500,
            message: error
        }
    }
}

const getCommentsOfAProductForSeller = async (args, _context) => {
    const { page, perPage, id } = args;
    if (!id) return {
        comments: [],
        allCommentsCount: 0,
        status: 400,
        message: 'id is required'
    }

    try {
        const condition = { productId: id }
        const skip = (page - 1) * perPage;

        const query = Comment.find(condition).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage)

        let allCommentsCount = 0
        const comments = await query.lean().exec();

        if (!skip) allCommentsCount = comments.length
        else allCommentsCount = await Comment.where(condition).countDocuments().exec();

        return {
            comments,
            allCommentsCount,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            comments: [],
            allCommentsCount: 0,
            status: 500,
            message: error
        }
    }
}

const getAllCommentsOfAUser = async (args, _context) => {
    const { page, perPage, id } = args;
    if (!id) return {
        comments: [],
        allCommentsCount: 0,
        status: 400,
        message: 'id is required'
    }

    try {
        const condition = { "ownerId": id }
        const skip = (page - 1) * perPage;

        const query = Comment.find(condition).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage)

        let allCommentsCount = 0
        const comments = await query.lean().exec();

        if (!skip) allCommentsCount = comments.length
        else allCommentsCount = await Comment.where(condition).countDocuments().exec();

        return {
            comments,
            allCommentsCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            comments: null,
            allCommentsCount: 0,
            status: 500,
            message: error
        }
    }

}

module.exports = {
    getAllComments,
    getOneComment,
    getCommentsOfAProduct,
    getCommentsOfAProductForSeller,
    getAllCommentsOfAUser
}