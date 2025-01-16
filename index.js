require('dotenv').config()
const express = require('express');
const compression = require('compression')
const connectDb = require('./server/config/db')
const routes = require('./server/routes/route');
const path = require("path")
const cors = require("cors")
const responseHandler = require('./server/middleware/responseHandler')

// route import 
const adminRoutes = require('./server/config/seed')


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDb();

// Middleware
app.use(express.json({limit:"50mb"}));
app.use(cors())
app.use(express.urlencoded({limit:"50mb",extended:false,parameterLimit:500000000}))
app.use(express.json())
app.use(compression())

app.use('/api', routes);

// Routes
adminRoutes.createAdmin() // call the function  directly to create the admin
// app.use('/admin',adminRoutes)
app.get('/',(req,res)=>{
    res.send('Welcome to SR Inventory Server')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// require('./server/config/seed').createAdmin

//global error handler
app.use(responseHandler)