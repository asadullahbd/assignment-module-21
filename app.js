import express from 'express';
import mongoose from 'mongoose';
import router from './routes/api.js';
import cookieParser from 'cookie-parser';
import { DATABASE, PORT } from './app/config/config.js';
import fileUpload from 'express-fileupload';



const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Routes
app.use(express.static("./app/uploads"));
app.use("/api",router);


// db connection and app listen 
mongoose.connect(DATABASE)
.then(()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
})
.catch(err => console.log(err));

