import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import routes from "./routes/app.js";

dotenv.config();

const app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// creating x-access-token header where we store the token value
app.use((req, res, next) => {
  res.set({ "x-access-token": "" });
  next()
});

// allow one origin to serve and block the rest
const corsOption = {
  origin : "http://localhost:3000"
}

// cors middleware
app.use(cors(corsOption))

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err, res) => {
    if (err) {
      console.log("Error connecting to database. " + err);
    } else {
      console.log("Connected to Database");
    }
  }
);

// app routes
routes(app);

app.get("/", (req, res) => {
  res.status(200).json({ status: "testing" });
});

app.listen(3001, () => {
  console.log("listen on port 3001");
});

export default app;