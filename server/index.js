import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;


//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('backend is listening succesfully.')
})