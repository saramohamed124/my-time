const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected Success!');
}).catch((err) => {
    console.log('Not Connected.');
})

app.get('/', (req, res) =>{
    res.send('Hello World')
})

app.listen(process.env.PORT, () => {
    console.log("Server Run Success on port 3050")
})