// const allowedOrigins = [
//     "http://localhost:3000"
// ]


// const corsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not Allowed by CORS!'))
//         }
//     },
//     optionsSuccessStatus: 200
// }

var allowlist = ["http://localhost:3000"]
var corsOptions = function (req, callback) {
    var corsOptionsDelegate;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptionsDelegate = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptionsDelegate = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptionsDelegate) // callback expects two parameters: error and options
}

module.exports = corsOptions