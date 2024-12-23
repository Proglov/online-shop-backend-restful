const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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

const userInPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
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
        required: true
    },
    telegramId: {
        type: Number
    },
    storeName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    officeAddress: {
        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City',
            required: true
        },
        completeAddress: {
            type: String,
            required: true
        }
    },
    warehouses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    }],
    workingPhone: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    validated: {
        type: Boolean,
        default: false
    },
});

const temporaryTelegramCodeSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    code: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: true } })

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    completeAddress: {
        type: String,
        required: true
    },
    citiesCovered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    }]
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
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    imagesUrl: [{
        type: String
    }],
    count: {
        type: Number,
        required: true
    }
});

const productHistorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    count: {
        type: Number,
        required: true
    }
}, { timestamps: { createdAt: true } });

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
})

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    ownerType: {
        type: String,
        enum: ['User', 'Seller'],
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'ownerType'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: {
            type: String,
            enum: ['User', 'Seller'],
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'likes.type'
        }
    }],
    disLikes: [{
        type: {
            type: String,
            enum: ['User', 'Seller'],
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'disLikes.type'
        }
    }],
    validated: {
        type: Boolean,
        default: false
    },
});

const temporaryImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: { createdAt: true } })

const transActionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalDiscount: {
        type: Number
    },
    totalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number
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
    },
    status: {
        type: String,
        enum: ['Requested', 'Sent', 'Received', 'Canceled'],
        default: 'Requested'
    },
    canceled: {
        canceledBy: {
            type: String,
            enum: ['seller', 'user'],
            default: 'seller'
        },
        reason: {
            type: String
        }
    },
    opinion: {
        rate: {
            type: Number,
            default: 0
        },
        comment: {
            type: String,
            default: ''
        }
    },
}, { timestamps: { createdAt: true } })

const transActionInPersonSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInPerson',
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
        },
        off: {
            type: Number,
            default: 0
        }
    }]
}, { timestamps: { createdAt: true } })

const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

const citySchema = new mongoose.Schema({
    provinceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province',
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

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
        type: Number,
        required: true,
    }
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

// the sellers can add this to some of their products, if a user buy at least this much, they will get an off percentage, at most $maxOffPrice tomans
const companyCouponForSomeProductsSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    productsIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    usersIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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
    remainingCount: { // limited people can buy this
        type: Number,
        required: true
    }
}, { timestamps: { createdAt: true, updatedAt: true } })

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
    maxOffPrice: { //for example at most 200thousand tomans off
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

sellerSchema.plugin(uniqueValidator, {
    message: '{PATH} already exists'
})

const User = mongoose.model('User', userSchema);
const UserInPerson = mongoose.model('UserInPerson', userInPersonSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Seller = mongoose.model('Seller', sellerSchema);
const TemporaryTelegramCode = mongoose.model('TemporaryTelegramCode', temporaryTelegramCodeSchema);
const Warehouse = mongoose.model('Warehouse', warehouseSchema);
const Product = mongoose.model('Product', productSchema);
const ProductHistory = mongoose.model('ProductHistory', productHistorySchema);
const Category = mongoose.model('Category', categorySchema);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);
const Comment = mongoose.model('Comment', commentSchema);
const TemporaryImage = mongoose.model('TemporaryImage', temporaryImageSchema);
const TransAction = mongoose.model('TransAction', transActionSchema);
const TransActionInPerson = mongoose.model('TransActionInPerson', transActionInPersonSchema);
const Province = mongoose.model('Province', provinceSchema);
const City = mongoose.model('City', citySchema);
const Festival = mongoose.model('Festival', festivalSchema);
const MajorShopping = mongoose.model('MajorShopping', majorShoppingSchema);
const CompanyCouponForSomeProducts = mongoose.model('CompanyCouponForSomeProducts', companyCouponForSomeProductsSchema);
const FloorBuyShippingFree = mongoose.model('FloorBuyShippingFree', floorBuyShippingFreeSchema);
const couponForAProduct = mongoose.model('couponForAProduct', couponForAProductSchema);
const couponForAllProducts = mongoose.model('couponForAllProducts', couponForAllProductsSchema);
const complimentaryCoupon = mongoose.model('complimentaryCoupon', complimentaryCouponSchema);

module.exports = { User, UserInPerson, Admin, Seller, TemporaryTelegramCode, Warehouse, Product, ProductHistory, Category, Subcategory, Comment, TemporaryImage, TransAction, TransActionInPerson, Province, City, Festival, MajorShopping, CompanyCouponForSomeProducts, FloorBuyShippingFree, couponForAProduct, couponForAllProducts, complimentaryCoupon };