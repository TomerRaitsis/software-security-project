import { UserModel } from "../models/dbSchema.js";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";

// Simulate home page
const homeBoard = (req, res) => {
  res.send("Welcome to the home page");
};


export { homeBoard };
