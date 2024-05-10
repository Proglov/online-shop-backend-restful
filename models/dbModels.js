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
    }
});

const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: { createdAt: true } });

const sellerSchema = new mongoose.Schema({
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
    bio: {
        type: String,
        default: ""
    },
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
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
    discountId: {
        type: String //because they could be from different discounts
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingCost: {
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

// the sellers can add a festival to their products, to determine the off percentage until a specific time
const festivalSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    offPercentage: {
        type: Number,
        required: true
    },
    until: {
        type: String,
        required: true,
    }
}, { timestamps: { createdAt: true } })

// the sellers can add a floor buy price, if a user buy at least this much, they will get a free shipping cost
const floorBuyShippingFreeSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    floorPrice: {
        type: Number,
        required: true
    },
}, { timestamps: { createdAt: true } })

// the sellers can add a major shopping to their products, if a user buy at least this much, they will get a off percentage
const majorShoppingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    offPercentage: {
        type: Number,
        required: true
    },
}, { timestamps: { createdAt: true } })

// give a coupon to sb to get some offPercentage with max and min price for a specific product 
// this coupon starts with COA
const couponForAProductSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    minBuy: {
        type: Number
    },
    maxOffPrice: {
        type: Number
    },
    offPercentage: {
        type: Number,
        required: true
    },
}, { timestamps: { createdAt: true } })

// give a coupon to sb to get some offPercentage with max and min price for all products of the seller
// this coupon starts with COL
const couponForAllProductsSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    minBuy: {
        type: Number
    },
    maxOffPrice: {
        type: Number
    },
    offPercentage: {
        type: Number,
        required: true
    },
}, { timestamps: { createdAt: true } })

// give a complimentary coupon to sb to get some (quantity) products with min price of shopping for all products of the seller
// this coupon starts with COM
const complimentaryCouponSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    minBuy: {
        type: Number
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
}, { timestamps: { createdAt: true } })

userSchema.plugin(uniqueValidator, {
    message: '{PATH} already exists'
})

sellerSchema.plugin(uniqueValidator, {
    message: '{PATH} already exists'
})

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Seller = mongoose.model('Seller', sellerSchema);
const Product = mongoose.model('Product', productSchema);
const Comment = mongoose.model('Comment', commentSchema);
const TransAction = mongoose.model('TransAction', transActionSchema);
const Festival = mongoose.model('Festival', festivalSchema);
const FloorBuyShippingFree = mongoose.model('FloorBuyShippingFree', floorBuyShippingFreeSchema);
const MajorShopping = mongoose.model('MajorShopping', majorShoppingSchema);
const couponForAProduct = mongoose.model('couponForAProduct', couponForAProductSchema);
const couponForAllProducts = mongoose.model('couponForAllProducts', couponForAllProductsSchema);
const complimentaryCoupon = mongoose.model('complimentaryCoupon', complimentaryCouponSchema);

module.exports = { User, Admin, Seller, Product, Comment, TransAction, Festival, FloorBuyShippingFree, MajorShopping, couponForAProduct, couponForAllProducts, complimentaryCoupon };
