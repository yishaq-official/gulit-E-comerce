const mongoose= require('mongoose');
const dotenv= require('dotenv');

dotenv.config();

const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('database succesfully connected.');
    } catch(err){
        console.log(err.message);
    }
}

module.exports=connectDB;