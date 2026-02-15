import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try{
        const conn= mongoose.connect(process.env.DATABASE_URL, (err)=>{
            if(err){
                console.log(err);
            }
            console.log('database is connected successfully.');
        }
} catch(err){
        console.log(err);
    }
}

export default connectDB;

