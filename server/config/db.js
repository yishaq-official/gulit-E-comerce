import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB= async()=>{
    try{

        await mongoose.connect(process.env.DATABASE_URL, ()=>{
            console.log('database connected succesfully.')
        });
    } catch(err){
        console.log(err.message);
    }
}

export default connectDB;