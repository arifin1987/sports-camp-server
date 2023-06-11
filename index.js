const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5000;



app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.59h68ks.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db('sportsCamp').collection('users');
    const instructorsCollection = client.db('sportsCamp').collection('instructor');
    const classCollection = client.db('sportsCamp').collection('class');
    const cartsCollection = client.db('sportsCamp').collection('carts');

    app.get('/instructors', async(req,res)=>{
      const result= await instructorsCollection.find().toArray();
      res.send(result);
    })
    
    app.get('/popularinstructors', async(req,res)=>{
      let query = {category:"popular"}
      const result = await instructorsCollection.find(query).limit(6).toArray();
        res.send(result);
      
    })

    app.get('/classes', async(req,res)=>{
      const result = await classCollection.find().toArray();
      res.send(result);


    })

    app.get('/popularclasses', async(req,res)=>{
      let query = {category:"popular"}
      const result = await classCollection.find(query).limit(6).toArray();
      res.send(result);
    })
    app.get('/users', async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post('/users', async(req,res)=>{
      const user = req.body;
      const query ={email: user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'user already exists'})
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    app.patch('users/admin/:id', async(req,res)=>{
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)};
      const updateDoc ={
        $set:{
          role:'admin'
        }
      };
      const result = await userCollection.updateOne(filter,updateDoc);
      res.send(result)
    })


    //cart  collection
    app.get('/carts', async(req,res)=>{
      const email = req.query.email;
      console.log(email);
      if(!email){
        res.send([])
      }
      const query = {email:email};
      const result = await cartsCollection.find(query).toArray();
      res.send(result);

    })

    app.post('/carts', async(req,res)=>{
      const item = req.body;
      console.log(item);
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    })

    app.delete('/carts/:id',async (req,res)=>{
      const id =req.params.id;
      const query ={_id:new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('sports camp is running')
})
app.listen(port,()=>{
    console.log(`sports camp is running on port ${port}`);
})