const { Comment } = require('../../models/dbModels');


const getAllComments = async (args, _context) => {
    const { page, perPage, validated } = args;

    try {
        //get all of them if validated is not specified
        if ((validated == undefined || validated == null) && validated !== false) {
            if (!page || !perPage) {
                const comments = await Comment.find({});
                return {
                    comments,
                    allCommentsCount: comments.length,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const comments = await Comment.find({}).skip(skip).limit(perPage);
            return {
                comments,
                allCommentsCount: comments.length,
                status: 200,
                message: null
            }

        }

        //if validated is true
        if (!!validated) {
            if (!page || !perPage) {
                const comments = await Comment.find({ validated: true });
                return {
                    comments,
                    allCommentsCount: comments.length,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const comments = await Comment.find({ validated: true }).skip(skip).limit(perPage);
            return {
                comments,
                allCommentsCount: comments.length,
                status: 200,
                message: null
            }
        }

        //if validated is false
        if (!page || !perPage) {
            const comments = await Comment.find({ validated: false });
            return {
                comments,
                allCommentsCount: comments.length,
                status: 200,
                message: null
            }
        }
        const skip = (page - 1) * perPage;
        const comments = await Comment.find({ validated: false }).skip(skip).limit(perPage);
        return {
            comments,
            allCommentsCount: comments.length,
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
    const { id } = args
    try {
        const comment = await Comment.findById(id);
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
    const { id } = args
    try {
        const comments = await Comment.find({ productId: id });
        return {
            comments,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            comments: null,
            status: 500,
            message: error
        }
    }
}

module.exports = {
    getAllComments,
    getOneComment,
    getCommentsOfAProduct
}