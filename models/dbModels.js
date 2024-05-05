const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    username: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    address: [{
        type: String
    }],
    phone: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: process.env.NORMAL_ROLE
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    subcategory: {
        type: String
    },
    imagesUrl: [{
        type: String
    }],
    offPercentage: {
        type: Number,
        default: 0
    },
    commentsIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    disLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    validated: {
        type: Boolean,
        default: false
    },
})

const transActionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    boughtProducts: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    address: {
        type: String,
        required: true,
    },
    shouldBeSentAt: {
        type: String,
        required: true,
    }
}, { timestamps: { createdAt: true } })


userSchema.plugin(uniqueValidator, {
    message: '{PATH} already exists'
})

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Comment = mongoose.model('Comment', commentSchema);
const TransAction = mongoose.model('TransAction', transActionSchema);

module.exports = { User, Product, Comment, TransAction };
