require('dotenv').config()
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express()
const cors = require('cors');


// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pu45iww.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db('productDB')
    const productCollection = database.collection('products')
    const BrandsCollection = database.collection('Brands')
    const cartCollection = client.db('productDB').collection('cartProducts')

    app.get('/brands', async (req, res) => {
      const cursor = BrandsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/cartProducts', async (req, res) => {
      const cartProduct = req.body
      const result = await cartCollection.insertOne(cartProduct)
      res.send(result)
    })

    app.delete('/cartProducts/:id', async(req, res) => {
      const id = req.params.id 
      console.log('delete cartProduct', id);
      const query = {_id : id} 
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/cartProducts', async (req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/cartProducts/:id', async (req, res) => {
      const id = req.params.id 
      console.log('cart id', id);
      const query = {_id : id} 
      const result = await cartCollection.findOne(query)
      res.send(result)
    })



    app.get('/products', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedProduct = req.body
      const product = {
        $set: {
          productName: updatedProduct.productName,
          price: updatedProduct.price,
          brandName: updatedProduct.brandName,
          description: updatedProduct.description,
          image: updatedProduct.image,
          ratings: updatedProduct.ratings,
          type: updatedProduct.type
        }
      }

      const result = await productCollection.updateOne(filter, product, options )
      res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id
      console.log('product id', id);
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })


    app.post('/products', async (req, res) => {
      const newProduct = req.body
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('TECH WEBSITE SERVER IS RUNNING')
})

app.listen(port, () => {
  console.log(`APP IS RUNNING ON port: ${port}`);
})