require('dotenv').config();
require('colors');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');


const corsOptions = require('./src/config/corsOptions');
const { temporaryImageCronJob, festivalsCronJob } = require('./src/lib/cronJob');
const { setUserInfo } = require('./src/lib/middlewares');
const swaggerDocs = require('./swagger');

const usersRouterGet = require('./src/routes/user/get');
const usersRouterPost = require('./src/routes/user/post');
const usersRouterUpdate = require('./src/routes/user/update');
// const usersRouterDelete = require('./src/routes/user/delete');

const userInPersonsRouterGet = require('./src/routes/userInPerson/get');
const userInPersonsRouterPost = require('./src/routes/userInPerson/post');

const sellersRouterGet = require('./src/routes/seller/get');
const sellersRouterPost = require('./src/routes/seller/post');
const sellersRouterUpdate = require('./src/routes/seller/update');
// const sellersRouterDelete = require('./src/routes/seller/delete');

const productsRouterGet = require('./src/routes/product/get');
const productsRouterPost = require('./src/routes/product/post');
const productsRouterUpdate = require('./src/routes/product/update');
// const productsRouterDelete = require('./src/routes/product/delete');

const categoriesRouterGet = require('./src/routes/category/get');
const categoriesRouterPost = require('./src/routes/category/post');

const subcategoriesRouterGet = require('./src/routes/subcategory/get');
const subcategoriesRouterPost = require('./src/routes/subcategory/post');

const commentsRouterGet = require('./src/routes/comment/get');
const commentsRouterPost = require('./src/routes/comment/post');
const commentsRouterUpdate = require('./src/routes/comment/update');
const commentsRouterDelete = require('./src/routes/comment/delete');

const transactionsRouterGet = require('./src/routes/transaction/get');
const transactionsRouterPost = require('./src/routes/transaction/post');
const transactionsRouterUpdate = require('./src/routes/transaction/update');

const transactionInPersonsRouterGet = require('./src/routes/transactionInPerson/get');
const transactionInPersonsRouterPost = require('./src/routes/transactionInPerson/post');

const imagesRouterPost = require('./src/routes/image/post');
const imagesRouterGet = require('./src/routes/image/get');
const imagesRouterDelete = require('./src/routes/image/delete');
const imagesRouterUpdate = require('./src/routes/image/update');

const festivalsRouterGet = require('./src/routes/discounts/get');
const festivalsRouterPost = require('./src/routes/discounts/post');
const festivalsRouterDelete = require('./src/routes/discounts/delete');


const app = express()

//connect to the database
const connectDB = require('./src/config/db');
connectDB()


//configuration
const limiter = rateLimit({
    windowMs: 3_600_000,
    limit: 5000,
    legacyHeaders: false
})
const PORT = process.env.PORT || 3500;
app.disable('x-powered-by');
app.use(limiter)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mongoSanitize());
swaggerDocs(app)


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

app.use('/transactionInPersonGet', setUserInfo, transactionInPersonsRouterGet);
app.use('/transactionInPersonPost', setUserInfo, transactionInPersonsRouterPost);

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