const allowedOrigins = [
    "http://localhost:4500"
]

// delete the || !origin part after deploy
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not Allowed by CORS!'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions