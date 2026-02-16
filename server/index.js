const express= require('express');
const cors= require('cors')
const dotenv= require('dotenv');
const connectDB= require('./config/db')
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path'); // Import path module at the top
const uploadRoutes = require('./routes/uploadRoutes'); 
const orderRoutes = require('./routes/orderRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT;


//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

//routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes); // Use


//MAKE THE FOLDER PUBLIC
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//port listener
app.listen(PORT, (err)=>{
    if(err){
        console.log(err);
    }
    console.log(`backend is listening succesfully at PORT ${PORT}.`)
})