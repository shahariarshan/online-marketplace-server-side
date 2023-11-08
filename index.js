const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


// middleware 

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hoyasjp.mongodb.net/?retryWrites=true&w=majority`;

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

    // collections 
    const jobCollections = client.db('jobDB').collection('jobs')
    const bidCollection = client.db('jobDB').collection('bids')
    // auth related api 
    // get items in db 
    app.get('/allJobs', async (req, res) => {
      const cursor = jobCollections.find()
      const result = await cursor.toArray()
      res.send(result)
    });

   


    app.post('/allJobs', async (req, res) => {
      const newJob = req.body
      console.log(newJob)
      const result = await jobCollections.insertOne(newJob)
      res.send(result)

    })

    app.get('/placeBid', async (req, res) => {
      const cursor = bidCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    });


    app.get('/placeBid/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query);
      const result = await bidCollection.findOne(query)
      res.send(result)
    });



    app.post('/placeBid', async (req, res) => {
      const newBid = req.body
      console.log(newBid)
      const result = await bidCollection.insertOne(newBid)
      res.send(result)

    })


    app.get('/allJobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query);
      const result = await jobCollections.findOne(query)
      res.send(result)
    })
  
    app.delete('/allJobs/:id',async(req,res)=>{
  const id = req.params.id;
  console.log(id);
  const query= { _id:new ObjectId(id)}
  const result= await jobCollections.deleteOne(query);
  res.send(result);
})

    // update 
    app.put('/allJobs/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true }
  const updateCategory = req.body
  const jobs = {
    $set: {
      email:updateCategory.email,
      title: updateCategory.title,
      category: updateCategory.category,
      data: updateCategory.data,
      description: updateCategory.description,
      miniPrice: updateCategory.miniPrice,
      maxPrice: updateCategory.maxPrice,
      
    }
  }
  const result = await jobCollections.updateOne(filter, jobs, options)
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


app.get('/', (req, res) => {
  res.send("Online marketing in running")
})
app.listen(port, () => {
  console.log(`Online marketing server is running on port ${port}`)
})