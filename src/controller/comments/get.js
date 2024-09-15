const { Comment } = require('../../models/dbModels');


const getAllComments = async (args, _context) => {
    const { page, perPage, validated } = args;

    try {
        //get all of them if validated is not specified
        if ((validated == undefined || validated == null) && validated !== false) {
            const allCommentsCount = await Comment.where().countDocuments().exec();
            if (!page || !perPage) {
                const comments = await Comment.find({}).populate({ path: "ownerId", select: 'name' }).populate({ path: "productId", select: 'name' }).select("-likes._id -disLikes._id -__v");
                return {
                    comments,
                    allCommentsCount,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const comments = await Comment.find({}).populate({ path: "ownerId", select: 'name' }).populate({ path: "productId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage);
            return {
                comments,
                allCommentsCount,
                status: 200,
                message: null
            }

        }

        //if validated is true
        if (validated === "true") {
            const allCommentsCount = await Comment.where({ validated: true }).countDocuments().exec();
            if (!page || !perPage) {
                const comments = await Comment.find({ validated: true }).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v");
                return {
                    comments,
                    allCommentsCount,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const comments = await Comment.find({ validated: true }).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage);
            return {
                comments,
                allCommentsCount,
                status: 200,
                message: null
            }
        }

        //if validated is false
        const allCommentsCount = await Comment.where({ validated: false }).countDocuments().exec();
        if (!page || !perPage) {
            const comments = await Comment.find({ validated: false }).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v");
            return {
                comments,
                allCommentsCount,
                status: 200,
                message: null
            }
        }
        const skip = (page - 1) * perPage;
        const comments = await Comment.find({ validated: false }).populate({ path: "productId", select: 'name' }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage);
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
    const { id } = args
    try {
        const comment = await Comment.findById(id).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v");
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
    let page = parseInt(args?.page)
    let perPage = parseInt(args?.perPage)
    try {
        if (!id) return {
            comments: [],
            status: 400,
            message: 'id is required'
        }


        if (!page || !perPage) {
            const allComments = await Comment.find({ productId: id, validated: true }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v");
            return {
                comments: allComments,
                status: 200,
                message: null
            }
        }

        page = page || 1;
        perPage = perPage || 10;
        const skip = (page - 1) * perPage;
        const allComments = await Comment.find({ productId: id, validated: true }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage);
        return {
            comments: allComments,
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
    const { id } = args
    let page = parseInt(args?.page)
    let perPage = parseInt(args?.perPage)
    try {
        if (!id) return {
            comments: [],
            allCommentsCount: 0,
            status: 400,
            message: 'id is required'
        }

        let allCommentsCount = await Comment.where({ productId: id }).countDocuments().exec();


        if (!page || !perPage) {
            const allComments = await Comment.find({ productId: id }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v");
            return {
                comments: allComments,
                allCommentsCount,
                status: 200,
                message: null
            }
        }

        page = page || 1;
        perPage = perPage || 10;
        const skip = (page - 1) * perPage;
        const allComments = await Comment.find({ productId: id }).populate({ path: "ownerId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage);
        return {
            comments: allComments,
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
    const { id, page, perPage } = args;

    try {

        const allCommentsCount = await Comment.where({ "ownerId": id }).countDocuments().exec();
        if (!page || !perPage) {
            const comments = await Comment.find({ "ownerId": id }).populate({ path: "ownerId", select: 'name' }).populate({ path: "productId", select: 'name' }).select("-likes._id -disLikes._id -__v");
            return {
                comments,
                allCommentsCount,
                status: 200,
                message: null
            }
        }
        const skip = (page - 1) * perPage;
        const comments = await Comment.find({ "ownerId": id }).populate({ path: "ownerId", select: 'name' }).populate({ path: "productId", select: 'name' }).select("-likes._id -disLikes._id -__v").skip(skip).limit(perPage);
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