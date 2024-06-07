import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();

// Globals
const Queries_Insert_Keys = [
  "productName",
  "productBrand",
  "productImageURL",
  "queryTitle",
  "boycottingReasonDetails",
  "userEmail",
  "userName",
  "userImage",
  "dateTime",
  "recommendationCount",
];
const Recommendations_Insert_Keys = [
  "title",
  "productName",
  "productImageURL",
  "reason",
  "queryId",
  "queryTitle",
  "queryProductName",
  "userEmail",
  "userName",
  "recommenderUserEmail",
  "recommenderUserName",
  "dateTime",
];

// Configuring App
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://alternative-seek.surge.sh", "https://alternative-seek.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

// Configuring Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poi1lw7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});
let db;

// Cookie Options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

// Authentication Middleware
const checkTokenAuthentication = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed!" });
  }

  try {
    const decrypted = jwt.verify(access_token, process.env.JWT_SECRET);
    req.user = decrypted;
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed!" });
  }

  next();
};

// Test Route
app.get("/", async (req, res) => {
  res.json({ status: "success", message: "Server is Running!" });
});

// Create and Set JWT Token
app.post("/authentication", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false });
    return;
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res
    .cookie("access_token", token, cookieOptions)
    .status(200)
    .json({ success: true });
});

// Remove JWT Token
app.get("/logout", async (req, res) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed!" });
  }

  res
    .clearCookie("access_token", cookieOptions)
    .status(200)
    .json({ success: true });
});

/* Tips & Guides Route */
// Get Tips and Guides
app.get("/tips-n-guides", async (req, res) => {
  const { limit } = req.query;
  let result;

  if (limit && !isNaN(Number(limit))) {
    // If only limit exists, return limit
    result = await db
      .collection("tips-n-guides")
      .find()
      .limit(Number(limit))
      .toArray();
  } else {
    // Else return all
    result = await db.collection("tips-n-guides").find().toArray();
  }
  res.status(200).json(result);
});

/* Queries Route */
// Get Queries Count
app.get("/queries/count", async (req, res) => {
  try {
    const result = await db.collection("queries").estimatedDocumentCount();
    res.status(200).json({ success: true, count: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a New Query -- Private Route
app.post("/queries", checkTokenAuthentication, async (req, res) => {
  const { email: tokenEmail } = req.user;
  const body = req.body;

  if (tokenEmail !== body.userEmail) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden Request" });
  }

  const allData = Queries_Insert_Keys.every((item) =>
    Object.keys(body).includes(item)
  );

  if (!allData) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  let result, status;
  try {
    const dbResult = await db.collection("queries").insertOne(body);
    result = { success: true, ...dbResult };
    status = 200;
  } catch (error) {
    result = {
      success: false,
      message: "Failed to Insert Item",
      error: error.message,
    };
    status = 500;
  }

  res.status(status).json(result);
});

// Read All Queries -- Public Route
app.get("/queries", async (req, res) => {
  const { skip, limit, search } = req.query;
  let query = {};
  let result;
  let count = undefined;

  if (search) {
    await db.collection("queries").createIndex({ productName: "text" });
    query = { $text: { $search: search } };
  }

  if (search && !limit) {
    result = await db
      .collection("queries")
      .find(query)
      .sort({ _id: -1 })
      .toArray();
  } else if (search && limit && !skip) {
    count = [...(await db.collection("queries").find(query).toArray())].length;

    result = await db
      .collection("queries")
      .find(query)
      .sort({ _id: -1 })
      .limit(Number(limit))
      .toArray();
  } else if (limit && !isNaN(Number(limit))) {
    result = await db
      .collection("queries")
      .find(query)
      .sort({ _id: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .toArray();
  } else {
    // Else return all
    result = await db.collection("queries").find().toArray();
  }
  res.status(200).json({ success: true, result, count });
});

// Get Single Query -- Public Route
app.get("/queries/:id", async (req, res) => {
  const id = req.params.id;
  let query;
  try {
    query = { _id: new ObjectId(id) };
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Item id Provided" });
    return;
  }

  let result, status;
  try {
    const dbResult = await db.collection("queries").findOne(query);
    result = dbResult
      ? { success: true, ...dbResult }
      : { success: false, message: "Item not Found!" };
    status = dbResult ? 200 : 404;
  } catch (error) {
    result = { success: false, message: "Item not Found!" };
    status = 404;
  }
  res.status(status).json(result);
});

// Update Query -- Private Route
app.put("/queries/:id", checkTokenAuthentication, async (req, res) => {
  const { email: tokenEmail } = req.user;
  const id = req.params.id;
  let body = req.body;

  let query;
  try {
    query = { _id: new ObjectId(id) };
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Item id Provided" });
    return;
  }

  const oldItem = await db.collection("queries").findOne(query);
  if (!oldItem) {
    res.status(404).json({ success: false, message: "Item not Found" });
    return;
  }

  if (oldItem.userEmail !== tokenEmail) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden Request" });
  }

  const newBody = {};
  Queries_Insert_Keys.forEach((item) => {
    const dt = body[item];
    if (dt) {
      newBody[item] = dt;
    }
  });
  body = newBody;

  if (Object.keys(body).length === 0) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  let result, status;
  try {
    const doc = {
      $set: body,
    };
    const dbResult = await db.collection("queries").updateOne(query, doc);

    result =
      dbResult.matchedCount === 0
        ? { success: false, message: "Item not Found!" }
        : dbResult.modifiedCount === 0
        ? { success: false, message: "Item Data wasn't updated" }
        : { success: true, ...dbResult };
    status =
      dbResult.matchedCount === 0
        ? 404
        : dbResult.modifiedCount === 0
        ? 400
        : 200;
  } catch (error) {
    result = {
      success: false,
      message: "Failed to Update Item",
      error: error.message,
    };
    status = 500;
  }

  res.status(status).json(result);
});

// Delete Query -- Private Route
app.delete("/queries/:id", checkTokenAuthentication, async (req, res) => {
  const { email: tokenEmail } = req.user;
  const id = req.params.id;
  let query;
  try {
    query = { _id: new ObjectId(id) };
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Item id Provided" });
    return;
  }

  const oldItem = await db.collection("queries").findOne(query);
  if (!oldItem) {
    res.status(404).json({ success: false, message: "Item not Found" });
    return;
  }

  if (oldItem.userEmail !== tokenEmail) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden Request" });
  }

  let result, status;
  try {
    const dbResult = await db.collection("queries").deleteOne(query);
    result =
      dbResult.deletedCount > 0
        ? { success: true, ...dbResult }
        : { success: false, message: "Item not Found!" };
    status = dbResult.deletedCount > 0 ? 200 : 404;
    if (status === 200) {
      await db.collection("recommendations").deleteMany({ queryId: id });
    }
  } catch (error) {
    result = {
      success: false,
      message: "Failed to Delete Item",
      error: error.message,
    };
    status = 500;
  }

  res.status(status).json(result);
});

/* Recommendations Route */

// Create a New Recommendation -- Private Route
app.post("/recommendations", checkTokenAuthentication, async (req, res) => {
  const { email: tokenEmail } = req.user;
  const body = req.body;

  if (body.recommenderUserEmail !== tokenEmail) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden Request" });
  }

  const allData = Recommendations_Insert_Keys.every((item) =>
    Object.keys(body).includes(item)
  );

  if (!allData) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  let result, status;
  try {
    const targetQuery = await db
      .collection("queries")
      .findOne({ _id: new ObjectId(String(body.queryId)) });
    if (!targetQuery) {
      return res
        .status(404)
        .json({ success: false, message: "Query Not Found!" });
    }

    const dbResult = await db.collection("recommendations").insertOne(body);

    await db
      .collection("queries")
      .updateOne(
        { _id: new ObjectId(String(targetQuery._id)) },
        { $set: { recommendationCount: targetQuery.recommendationCount + 1 } }
      );

    result = { success: true, ...dbResult };
    status = 200;
  } catch (error) {
    result = {
      success: false,
      message: "Failed to Insert Recommendation",
      error: error.message,
    };
    status = 500;
  }

  res.status(status).json(result);
});

// Read All Recommendations -- Public Route
app.get("/recommendations", async (req, res) => {
  const { queryId } = req.query;
  let query = {};
  if (queryId) {
    query = { queryId };
  }
  const result = await db.collection("recommendations").find(query).toArray();
  res.status(200).json(result);
});

// Get Single Query -- Public Route
app.get("/recommendations/:id", async (req, res) => {
  const id = req.params.id;
  let query;
  try {
    query = { _id: new ObjectId(id) };
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Item id Provided" });
    return;
  }

  let result, status;
  try {
    const dbResult = await db.collection("recommendations").findOne(query);
    result = dbResult
      ? { success: true, ...dbResult }
      : { success: false, message: "Item not Found!" };
    status = dbResult ? 200 : 404;
  } catch (error) {
    result = { success: false, message: "Item not Found!" };
    status = 404;
  }
  res.status(status).json(result);
});

// Update Recommendation -- Private Route (Just to Create full CRUD)
app.put("/recommendations/:id", checkTokenAuthentication, async (req, res) => {
  const { email: tokenEmail } = req.user;
  const id = req.params.id;
  let body = req.body;

  let query;
  try {
    query = { _id: new ObjectId(id) };
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Invalid Item id Provided" });
    return;
  }

  const oldItem = await db.collection("recommendations").findOne(query);
  if (!oldItem) {
    res.status(404).json({ success: false, message: "Item not Found" });
    return;
  }

  if (oldItem.recommenderUserEmail !== tokenEmail) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden Request" });
  }

  const newBody = {};
  Recommendations_Insert_Keys.forEach((item) => {
    const dt = body[item];
    if (dt && item !== "queryId") {
      newBody[item] = dt;
    }
  });
  body = newBody;

  if (Object.keys(body).length === 0) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  let result, status;
  try {
    const doc = {
      $set: body,
    };
    const dbResult = await db
      .collection("recommendations")
      .updateOne(query, doc);

    result =
      dbResult.matchedCount === 0
        ? { success: false, message: "Item not Found!" }
        : dbResult.modifiedCount === 0
        ? { success: false, message: "Item Data wasn't updated" }
        : { success: true, ...dbResult };
    status =
      dbResult.matchedCount === 0
        ? 404
        : dbResult.modifiedCount === 0
        ? 400
        : 200;
  } catch (error) {
    result = {
      success: false,
      message: "Failed to Update Item",
      error: error.message,
    };
    status = 500;
  }

  res.status(status).json(result);
});

// Delete Query -- Private Route
app.delete(
  "/recommendations/:id",
  checkTokenAuthentication,
  async (req, res) => {
    const { email: tokenEmail } = req.user;
    const id = req.params.id;
    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Item id Provided" });
      return;
    }

    let result, status;
    try {
      const oldItem = await db.collection("recommendations").findOne(query);
      if (!oldItem) {
        res.status(404).json({ success: false, message: "Item not Found" });
        return;
      }

      if (oldItem.recommenderUserEmail !== tokenEmail) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden Request" });
      }

      const targetQuery = await db
        .collection("queries")
        .findOne({ _id: new ObjectId(String(oldItem.queryId)) });

      const dbResult = await db.collection("recommendations").deleteOne(query);
      result =
        dbResult.deletedCount > 0
          ? { success: true, ...dbResult }
          : { success: false, message: "Item not Found!" };
      status = dbResult.deletedCount > 0 ? 200 : 404;

      if (status === 200) {
        await db.collection("queries").updateOne(
          { _id: new ObjectId(String(targetQuery._id)) },
          {
            $set: {
              recommendationCount: targetQuery.recommendationCount - 1,
            },
          }
        );
      }
    } catch (error) {
      result = {
        success: false,
        message: "Failed to Delete Item",
        error: error.message,
      };
      status = 500;
    }

    res.status(status).json(result);
  }
);

/* User Specific Route */

// Get Current user's Created Queries
app.get("/me/queries", checkTokenAuthentication, async (req, res) => {
  const query = { userEmail: req.user.email };
  const result = await db
    .collection("queries")
    .find(query)
    .sort({ _id: -1 })
    .toArray();
  res.status(200).json({ success: true, result });
});

// Get Current user's Created Recommendations
app.get("/me/recommendations", checkTokenAuthentication, async (req, res) => {
  const query = { recommenderUserEmail: req.user.email };
  const result = await db
    .collection("recommendations")
    .find(query)
    .sort({ _id: -1 })
    .toArray();
  res.status(200).json({ success: true, result });
});

// Get Recommendations made to Current User
app.get(
  "/me/recommendations/for-me",
  checkTokenAuthentication,
  async (req, res) => {
    const query = { userEmail: req.user.email };
    const result = await db
      .collection("recommendations")
      .find(query)
      .sort({ _id: -1 })
      .toArray();
    res.status(200).json({ success: true, result });
  }
);

// Connecting to MongoDB first, then Starting the Server
client
  .connect()
  .then(async () => {
    db = client.db("alternative-seek");
    app.listen(port, () => {
      console.log(`Running in port ${port}`);
    });
  })
  .catch(console.dir);
