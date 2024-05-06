const { getUserFromToken } = require('./Functions');

const setUserInfo = async (req, res, next) => {
    req.userInfo = await getUserFromToken(req.headers.authorization)
    next()
}

module.exports = {
    setUserInfo
}