const { Product } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');



module.exports = {
    getMe,
    getUsers,
    isUserAdmin,
    getUsersCount
}