const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5000;



app.use(express.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.send('sports camp is running')
})
app.listen(port,()=>{
    console.log(`sports camp is running on port ${port}`);
})