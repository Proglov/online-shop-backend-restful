require('dotenv').config();
require('colors');
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { temporaryImageCronJob, festivalsCronJob } = require('./lib/cronJob');

const app = express()

const { setUserInfo } = require('./lib/middlewares');

const usersRouterGet = require('./routes/user/get');
const usersRouterPost = require('./routes/user/post');
const usersRouterUpdate = require('./routes/user/update');
// const usersRouterDelete = require('./routes/user/delete');

const userInPersonsRouterGet = require('./routes/userInPerson/get');
const userInPersonsRouterPost = require('./routes/userInPerson/post');

const sellersRouterGet = require('./routes/seller/get');
const sellersRouterPost = require('./routes/seller/post');
const sellersRouterUpdate = require('./routes/seller/update');
// const sellersRouterDelete = require('./routes/seller/delete');

const productsRouterGet = require('./routes/product/get');
const productsRouterPost = require('./routes/product/post');
const productsRouterUpdate = require('./routes/product/update');
// const productsRouterDelete = require('./routes/product/delete');

const categoriesRouterGet = require('./routes/category/get');
const categoriesRouterPost = require('./routes/category/post');

const subcategoriesRouterGet = require('./routes/subcategory/get');
const subcategoriesRouterPost = require('./routes/subcategory/post');

const commentsRouterGet = require('./routes/comment/get');
const commentsRouterPost = require('./routes/comment/post');
const commentsRouterUpdate = require('./routes/comment/update');
const commentsRouterDelete = require('./routes/comment/delete');

const transactionsRouterGet = require('./routes/transaction/get');
const transactionsRouterPost = require('./routes/transaction/post');
const transactionsRouterUpdate = require('./routes/transaction/update');


const imagesRouterPost = require('./routes/image/post');
const imagesRouterGet = require('./routes/image/get');
const imagesRouterDelete = require('./routes/image/delete');
const imagesRouterUpdate = require('./routes/image/update');


const festivalsRouterGet = require('./routes/festivals/get');
const festivalsRouterPost = require('./routes/festivals/post');
const festivalsRouterDelete = require('./routes/festivals/delete');


const PORT = process.env.PORT || 3500;
const connectDB = require('./config/db');


//connect to the database
connectDB()

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/userGet', setUserInfo, usersRouterGet);
app.use('/userPost', setUserInfo, usersRouterPost);
app.use('/userUpdate', setUserInfo, usersRouterUpdate);
// app.use('/userDelete', setUserInfo, usersRouterDelete);

app.use('/userInPersonGet', setUserInfo, userInPersonsRouterGet);
app.use('/userInPersonPost', setUserInfo, userInPersonsRouterPost);

app.use('/sellerGet', setUserInfo, sellersRouterGet);
app.use('/sellerPost', setUserInfo, sellersRouterPost);
app.use('/sellerUpdate', setUserInfo, sellersRouterUpdate);
// app.use('/sellerDelete', setUserInfo, sellersRouterDelete);

app.use('/productGet', productsRouterGet);
app.use('/productPost', setUserInfo, productsRouterPost);
app.use('/productUpdate', setUserInfo, productsRouterUpdate);
// app.use('/productDelete', setUserInfo, productsRouterDelete);

app.use('/categoryGet', categoriesRouterGet);
app.use('/categoryPost', setUserInfo, categoriesRouterPost);

app.use('/subcategoryGet', subcategoriesRouterGet);
app.use('/subcategoryPost', setUserInfo, subcategoriesRouterPost);

app.use('/commentGet', commentsRouterGet);
app.use('/commentPost', setUserInfo, commentsRouterPost);
app.use('/commentUpdate', setUserInfo, commentsRouterUpdate);
app.use('/commentDelete', setUserInfo, commentsRouterDelete);

app.use('/transactionGet', setUserInfo, transactionsRouterGet);
app.use('/transactionPost', setUserInfo, transactionsRouterPost);
app.use('/transactionUpdate', setUserInfo, transactionsRouterUpdate);

app.use('/imageGet', imagesRouterGet);
app.use('/imagePost', setUserInfo, imagesRouterPost);
app.use('/imageUpdate', setUserInfo, imagesRouterUpdate);
app.use('/imageDelete', setUserInfo, imagesRouterDelete);

app.use('/festivalsGet', festivalsRouterGet);
app.use('/festivalsPost', setUserInfo, festivalsRouterPost);
app.use('/festivalsDelete', setUserInfo, festivalsRouterDelete);



app.listen(PORT, () => {
    temporaryImageCronJob.start()
    festivalsCronJob.start()
    console.log(`server running on port ${PORT}`.blue)
})
