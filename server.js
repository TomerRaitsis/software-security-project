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

const corsOptions = {
  origin: [
    "http://localhost:8080",  // For HTTP access
    "https://localhost:8443", // For HTTPS access
  ],
  credentials: true, // If you need to send cookies or authentication headers
};

app.use(cors(corsOptions));

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Error connecting to database: ", err);
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
  res.status(200).send(`
    <h1 style="text-align: center; margin-top: 20px;">
      Welcome to our secure HTTPS role-based authentication API
    </h1>
  `);});


const server = app.listen(3001, () => {
  console.log("listen on port 3001");
});

// Load SSL certificate and key
const dirname = path.resolve();
const options = {
  key: fs.readFileSync(path.join(dirname, 'certs', 'server.key')),
  cert: fs.readFileSync(path.join(dirname, 'certs', 'server.cert')),
};


// Start HTTPS server
https.createServer(options, app).listen(8443, () => {
  console.log('Server is running on https://localhost:8443');
});

// Redirect HTTP to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'].replace(/:\d+/, ':8443') + req.url });
  res.end();
}).listen(8080, () => {
  console.log('HTTP to HTTPS redirect server running on http://localhost:8080');
});

export {server,app};