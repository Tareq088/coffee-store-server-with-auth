const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config()


        //middleware
app.use(cors());
app.use(express.json());
// const uri = "mongodb+srv://coffee-monster:EKxJY58plQU7mYFT@cluster0.taikvqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

        //mongo db er coder copy,paste
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.taikvqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      //crate the db
    const coffeeCollection = client.db('coffeeDB').collection('coffees');
    const usersCollection = client.db("coffeeDB").collection('users')
        //show data to server:/3000/coffees (json data)
              //coffee related data
    app.get("/coffees", async(req,res)=>{
      const result =await coffeeCollection.find().toArray();
      res.send(result);
    })
        //post data
    app.post("/coffees",async(req, res)=>{
      const newCoffee = req.body;
      console.log("new data is:", newCoffee);
          // show data to mongodb
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    } )
        // delete coffee
    app.delete('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })
        // view(findOne) the data
    app.get("/coffees/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    })
          //update the data
    app.put("/coffees/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updateDoc = {
            // updated coffee dilam karon full object kei change korbo
              // othoba {name:updatedCoffee.name / price:updatedCoffee.price} eveabeo specific value change kora jay
      $set: updatedCoffee,
      };
      const result = await coffeeCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })
              //user related API
              //get the data (ete data gulo 3000/users server e dekhabe)
    app.get("/users", async(req,res)=>{
      const result = await usersCollection.find().toArray();
      res.send(result)
    })
              //post the data
    app.post('/users', async(req,res)=>{
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    })
              //delete the data
    app.delete("/users/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })
            //update the data using PATCH
    app.patch('/users', async(req,res)=>{
      // console.log("update the signInINfo:",req.body)
      const signInInfo = req.body;
      const {email, lastSignInTime} = signInInfo;
      const filter = {email: email};
      const updateDoc ={
        $set:{
              // 1st lastSignInTime ta hoilo mongodb er keyword: , 2nd lastSignInTime ta hoilo upore je destructure kore updated sigintime paichi seta
          lastSignInTime: lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result)
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


app.get("/", (req,res)=>{
        // server e show kore
    res.send("coffee server is running")
})

app.listen(port, ()=>{
    // cmd te show kore
    console.log("server is running on port:", port)
})
