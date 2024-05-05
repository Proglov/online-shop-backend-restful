require('dotenv').config();
require('colors');
const express = require('express');
const { User, Product, Comment, TransAction } = require('./models/dbModels');

const app = express();

const PORT = process.env.PORT || 3500;
const connectDB = require('./config/db');




app.listen(PORT, () => console.log(`server running on port ${PORT}`.blue))
