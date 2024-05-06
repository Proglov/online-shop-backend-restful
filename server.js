require('dotenv').config();
require('colors');
const express = require('express');
// const corsOptions = require('../config/corsOptions');

const app = express()

const { setUserInfo } = require('./lib/middlewares');

const usersRouterGet = require('./routes/user/get');

// const { User, Product, Comment, TransAction } = require('./models/dbModels');

// const { getUserFromToken } = require('./lib/Functions');


const PORT = process.env.PORT || 3500;
const connectDB = require('./config/db');


//connect to the database
connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', setUserInfo, usersRouterGet)

app.listen(PORT, () => console.log(`server running on port ${PORT}`.blue))
