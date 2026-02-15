import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT;


//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (err)=>{
    if(err){
        console.log(err);
    }
    console.log(`backend is listening succesfully at PORT ${PORT}.`)
})