require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contentRouter = require('./router/ContentRouter.js');

const port = process.env.PORT || 3000;

const app = express();
const fs = require('fs');
const path = require('path')

app.use(express.json());
app.use(cors());

app.use("/cache/images", express.static("cache/images"));

app.use("/", contentRouter);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connected to DB');
        app.listen(port, () => console.log('Server starts on port', port))
    } catch (e) {
        console.log(e)
    }
}

start();