const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');
const dashboardRoutes = require('./routes/dashboard');


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRoutes);
app.use('/api/records',recordRoutes);
app.use('/api/dashboard',dashboardRoutes);


app.get('/',(req,res)=>{
    res.status(200).json({
        message:"FinFlow API is running..."
    })
})


module.exports = app;