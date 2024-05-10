require('dotenv').config();
require('colors');
const express = require('express');
// const corsOptions = require('../config/corsOptions');

const app = express()

const { setUserInfo } = require('./lib/middlewares');

const usersRouterGet = require('./routes/user/get');
const usersRouterPost = require('./routes/user/post');


const PORT = process.env.PORT || 3500;
const connectDB = require('./config/db');


//connect to the database
connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/userGet', setUserInfo, usersRouterGet);
app.use('/userPost', setUserInfo, usersRouterPost);

app.listen(PORT, () => console.log(`server running on port ${PORT}`.blue))
