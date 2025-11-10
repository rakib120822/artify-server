const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fbeug99.mongodb.net/?appName=Cluster0`;

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
    const favoriteCollection = artifyDB.collection("favoriteCollection");

    //middlewares

    const verifyOwner = async (req, res, next) => {
      try {
        const { id } = req.params;
        const { email } = req.query;

        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .send({ success: false, message: "Invalid artwork ID" });
        }

        const artwork = await artworkCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!artwork) {
          return res
            .status(404)
            .send({ success: false, message: "Artwork not found" });
        }

        if (artwork.userEmail !== email) {
          return res.status(403).send({
            success: false,
            message: "Forbidden — you are not the owner",
          });
        }

        // ✅ User is authorized
        req.artwork = artwork; // store it if needed later
        next();
      } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    };

    //routes

    // get all art works
    app.get("/artworks", async (req, res) => {
      const result = await artworkCollection.find({}).toArray();
      res.send(result);
    });

    //get details of a artwork
    app.get("/artwork/:id", async (req, res) => {
      const { id } = req.params;
      const _id = new ObjectId(id);
      const result = await artworkCollection.findOne({ _id });
      res.send(result);
    });

    // get my artwork
    app.get("/my-artworks", async (req, res) => {
      const { email } = req.query;
      const result = await artworkCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    // get favorite artworks
    app.get("/favorite-artworks", async (req, res) => {
      const { email } = req.query;
      const favorites = await favoriteCollection
        .find({ userEmail: email })
        .toArray();
      const artworksId = favorites.map((favorite) => new ObjectId(favorite.id));

      const result = await artworkCollection
        .find({ _id: { $in: artworksId } })
        .toArray();
      res.send(result);
    });

    // get artwork from search query
    app.get("/artworks/search", async (req, res) => {
      const query = req.body.query || "";
      const result = await artworkCollection
        .find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { userName: { $regex: query, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    // add a favorite artwork
    app.post("/favorite/:id", async (req, res) => {
      const { email } = req.query;
      const { id } = req.params;

      const result = await favoriteCollection.insertOne({
        userEmail: email,
        id: new ObjectId(id),
      });

      res.send(result);
    });

    // remove from favorite artworks
    app.delete("/favorite/:id", async (req, res) => {
      const { id } = req.params;
      const email = req.query.email;
      const result = await favoriteCollection.deleteOne({
        userEmail: email,
        id: new ObjectId(id),
      });
      res.send(result);
    });

    // update like numbers
    app.patch("/artwork/:id", async (req, res) => {
      const { id } = req.params;
      const result = await artworkCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { price: 10 } }
      );

      res.send(result);
    });

    // update user artwork
    app.put("/artwork/:id", verifyOwner, async (req, res) => {
      const filter = { _id: req.artwork._id };
      const updateData = { $set: req.body };
      const result = await artworkCollection.updateOne(filter, updateData);
      res.send({ success: true });
    });

    // add a new artwork
    app.post("/artworks", async (req, res) => {
      const artwork = req.body;
      const result = await artworkCollection.insertOne(artwork);
      res.send(result);
    });

    // delete a artwork
    app.delete("/artwork/:id", verifyOwner, async (req, res) => {
      const artwork = req.artwork; 
      await artworkCollection.deleteOne({ _id: artwork._id });
      res.send("Deleted successfully");
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
