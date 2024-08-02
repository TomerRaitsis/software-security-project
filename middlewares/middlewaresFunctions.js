import { UserModel } from "../models/dbSchema.js";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";

// Middleware to validate password
const validatePassword = (req, res, next) => {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (!re.test(req.body.password)) {
    res.json({
      status: false,
      message:
        "Password should contain at least 8 characters, 1 number, 1 lowercase character (a-z), 1 uppercase character (A-Z) and contains only 0-9a-zA-Z",
    });
    return;
  }
  next();
};

// Middleware to check if email is already used
const checkIfEmailIsAlreadyUsed = async (req, res, next) => {
  if (!req.body.email) {
    res.json({ status: false, message: "email is not provided" });
  }
  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    res.json({ status: false, message: "email already exists" });
    return;
  }
  next();
};

// Middleware to verify JWT token
const verifyJwtToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    res.json({
      status: false,
      message: "token is not provided",
    });
    return;
  }
  let verification = await jwt.verify(token, jwtConfig);
  if (!verification) {
    res.json({
      status: false,
      message: "not authorized",
    });
    return;
  }
  req.userID = verification.id;
  next();
};

// Middleware to verify if the user has the role supervisor
const checkIfSupervisor = async (req, res, next) => {
  // console.log(req.userID);
  let user = await UserModel.findOne({ _id: req.userID });
  if (!user.roles.includes("ROLE_SUPERVISOR")) {
    res.json({ status: false, message: "You are not supervisor" });
    return;
  }
  next();
};

// Middleware to verify if the user has the role admin
const checkIfAdmin = async (req, res, next) => {
  let user = await UserModel.findOne({ _id: req.userID });
  if (!user.roles.includes("ROLE_ADMIN")) {
    res.json({ status: false, message: "You are not admin" });
    return;
  }
  next();
};

export { validatePassword, checkIfEmailIsAlreadyUsed, verifyJwtToken, checkIfSupervisor, checkIfAdmin };
