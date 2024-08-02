import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

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

// Rate limiter middleware to limit requests from each IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Create a write stream for logging requests
const accessLogStream = fs.createWriteStream(path.join(path.resolve(), 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use('/api/', apiLimiter);


// Initialize application routes
routes(app);


// Default route
app.get("/", (req, res) => {
  res.status(200).json({ status: "testing" });
});


const server = app.listen(3001, () => {
  console.log("listen on port 3001");
});

// // Load SSL certificate and key
// const dirname = path.resolve();
// const options = {
//   key: fs.readFileSync(path.resolve(dirname, 'selfsigned.key')),
//   cert: fs.readFileSync(path.resolve(dirname, 'selfsigned.crt'))
// };

// // Start HTTPS server
// https.createServer(options, app).listen(443, () => {
//   console.log('Server is running on https://localhost:443');
// });

// // Redirect HTTP to HTTPS
// http.createServer((req, res) => {
//   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//   res.end();
// }).listen(80, () => {
//   console.log('HTTP to HTTPS redirect server running on http://localhost:80');
// });

export {server, app};