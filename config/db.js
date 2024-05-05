const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`connected to the database: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB