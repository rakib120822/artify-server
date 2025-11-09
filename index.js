const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");



const port = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fbeug99.mongodb.net/?appName=Cluster0`;

app.get("/", (req, res) => {
  res.send("hellow form server");
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database create
    const artifyDB = client.db("artifyDB");
    const artworkCollection = artifyDB.collection("artworkCollection");

    //routes
    app.post("/add-artwork", async (req, res) => {
      const artwork = req.body;
      const result = await artworkCollection.insertOne(artwork);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is lisenting");
});
