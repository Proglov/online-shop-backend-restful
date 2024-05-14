require('dotenv').config();
require('colors');
const express = require('express');
// const corsOptions = require('../config/corsOptions');

const app = express()

const { setUserInfo } = require('./lib/middlewares');

const usersRouterGet = require('./routes/user/get');
const usersRouterPost = require('./routes/user/post');
const usersRouterUpdate = require('./routes/user/update');
const usersRouterDelete = require('./routes/user/delete');

const productsRouterGet = require('./routes/product/get');
const productsRouterPost = require('./routes/product/post');
const productsRouterUpdate = require('./routes/product/update');
const productsRouterDelete = require('./routes/product/delete');

const commentsRouterGet = require('./routes/comment/get');
const commentsRouterPost = require('./routes/comment/post');
const commentsRouterUpdate = require('./routes/comment/update');
const commentsRouterDelete = require('./routes/comment/delete');

const transactionsRouterGet = require('./routes/transaction/get');
// const transactionsRouterPost = require('./routes/transaction/post');
// const transactionsRouterUpdate = require('./routes/transaction/update');
// const transactionsRouterDelete = require('./routes/transaction/delete');


const PORT = process.env.PORT || 3500;
const connectDB = require('./config/db');


//connect to the database
connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/userGet', setUserInfo, usersRouterGet);
app.use('/userPost', setUserInfo, usersRouterPost);
app.use('/userUpdate', setUserInfo, usersRouterUpdate);
app.use('/userDelete', setUserInfo, usersRouterDelete);

app.use('/productGet', productsRouterGet);
app.use('/productPost', setUserInfo, productsRouterPost);
app.use('/productUpdate', setUserInfo, productsRouterUpdate);
app.use('/productDelete', setUserInfo, productsRouterDelete);

app.use('/commentGet', commentsRouterGet);
app.use('/commentPost', setUserInfo, commentsRouterPost);
app.use('/commentUpdate', setUserInfo, commentsRouterUpdate);
app.use('/commentDelete', setUserInfo, commentsRouterDelete);

app.use('/transactionGet', setUserInfo, transactionsRouterGet);
// app.use('/transactionPost', setUserInfo, transactionsRouterPost);

app.listen(PORT, () => console.log(`server running on port ${PORT}`.blue))
