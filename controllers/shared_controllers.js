import { UserModel } from "../models/dbShema.js";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";

// simulating home page
const homeBoard = (req, res) => {
  res.send("Welcome to the home page");
};


export { homeBoard };
