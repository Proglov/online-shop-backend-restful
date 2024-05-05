require('dotenv').config();
require('colors');
const express = require('express');
// const corsOptions = require('../config/corsOptions');

const app = express()

// const { User, Product, Comment, TransAction } = require('./models/dbModels');

// const { getUserFromToken } = require('./lib/Functions');


const PORT = process.env.PORT || 3500;
const connectDB = require('./config/db');


//connect to the database
connectDB()

app.get('/user', (rea, res) => {
    res.send('hi')
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`.blue))
