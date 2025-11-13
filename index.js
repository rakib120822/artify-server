const express = require("express");
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceKey.json");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fbeug99.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// token verification
const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ message: "unauthorization access. token not found" });
  }
  const token = authorization.split(" ")[1];
  try {
    await admin.auth().verifyIdToken(token);
    next();
  } catch (err) {
    return res.status(401).send("unauthorized access");
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database create
    const artifyDB = client.db("artifyDB");
    const artworkCollection = artifyDB.collection("artworkCollection");
    const favoriteCollection = artifyDB.collection("favoriteCollection");
    const userLikesCollection = artifyDB.collection("userLikesCollection");

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
        res.status(500).send({ success: false, message: "Server error" });
      }
    };

    //routes

    // get all art works
    app.get("/artworks", async (req, res) => {
      const result = await artworkCollection.find({}).toArray();
      res.send(result);
    });

    //get latest art works
    app.get("/artworks/latest", async (req, res) => {
      const result = await artworkCollection
        .find({})
        .sort({ created_at: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    //get details of a artwork
    app.get("/artwork/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const _id = new ObjectId(id);
      const result = await artworkCollection.findOne({ _id });
      res.send(result);
    });

    // get my artwork
    app.get("/my-artworks", verifyToken, async (req, res) => {
      const { email } = req.query;
      const result = await artworkCollection
        .find({ artist_email: email })
        .toArray();
      res.send(result);
    });

    // get favorite artworks
    app.get("/favorite-artworks", verifyToken, async (req, res) => {
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

    //get favorite artWork collection
    app.get("/user/favorite-artworks", async (req, res) => {
      const { email } = req.query;
      const result = await favoriteCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    // get artwork from search query
    app.get("/artworks/search", async (req, res) => {
      const query = req.query.search || "";
      const result = await artworkCollection
        .find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { artist_name: { $regex: query, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    // add a favorite artwork
    app.post("/favorite/:id", verifyToken, async (req, res) => {
      const { email } = req.query;
      const { id } = req.params;
      if (!email || !id) {
        return res
          .status(400)
          .json({ message: "Email and artwork ID are required" });
      }

      const existing = await favoriteCollection.findOne({
        userEmail: email,
        id: new ObjectId(id),
      });
      if (existing) {
        return res.status(200).json({ message: "Already in favorites" });
      }
      const result = await favoriteCollection.insertOne({
        userEmail: email,
        id: new ObjectId(id),
      });

      res.send(result);
    });

    // remove from favorite artworks
    app.delete("/favorite/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const email = req.query.email;
      const result = await favoriteCollection.deleteOne({
        userEmail: email,
        id: new ObjectId(id),
      });
      res.send(result);
    });
    //get likes
    app.get("/user/likes", async (req, res) => {
      const { email } = req.query;

      const result = await userLikesCollection.find({ email }).toArray();

      res.send(result);
    });

    // update like numbers
    app.put("/artwork/like/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const { email } = req.query;
      try {
        // Find user likes
        let user = await userLikesCollection.findOne({ email });

        if (user) {
          let likedBefore = user.likes.some((like) => like.toString() === id);

          if (likedBefore) {
            // Unlike: decrement artwork like
            const result = await artworkCollection.updateOne(
              { _id: new ObjectId(id) },
              { $inc: { like: -1 } }
            );

            // Remove artwork from user's likes
            user.likes = user.likes.filter((like) => like.toString() !== id);
          } else {
            // Like: increment artwork like
            await artworkCollection.updateOne(
              { _id: new ObjectId(id) },
              { $inc: { like: 1 } }
            );

            user.likes.push(new ObjectId(id));
          }

          // Update user document in MongoDB
          await userLikesCollection.updateOne(
            { email },
            { $set: { likes: user.likes } }
          );

          const result = await userLikesCollection.findOne({ email });
          const artworkObject = await artworkCollection.findOne({
            _id: new ObjectId(id),
          });
          res.json({
            message: likedBefore ? "Unliked" : "Liked",
            result,
            artworkObject,
          });
        } else {
          // New user document
          const newDoc = {
            email,
            likes: [new ObjectId(id)],
          };

          await userLikesCollection.insertOne(newDoc);

          // Increment artwork like
          await artworkCollection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { like: 1 } }
          );

          const result = await userLikesCollection.findOne({ email });
          const artworkObject = await artworkCollection.findOne({
            _id: new ObjectId(id),
          });
          res.json({
            message: likedBefore ? "Unliked" : "Liked",
            result,
            artworkObject,
          });

          res.json({ message: "Liked" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update like" });
      }
    });

    // update user artwork
    app.put("/artwork/:id", verifyToken, verifyOwner, async (req, res) => {
      const filter = { _id: req.artwork._id };
      const updateData = { $set: req.body };
      const result = await artworkCollection.updateOne(filter, updateData);
      res.send({ success: true });
    });

    // add a new artwork
    app.post("/artworks", verifyToken, async (req, res) => {
      const artwork = req.body;
      const result = await artworkCollection.insertOne(artwork);
      res.send(result);
    });

    // delete a artwork
    app.delete("/artwork/:id", verifyToken, verifyOwner, async (req, res) => {
      const artwork = req.artwork;
      await artworkCollection.deleteOne({ _id: artwork._id });
      res.send("Deleted successfully");
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port);
