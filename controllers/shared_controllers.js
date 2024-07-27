import { UserModel } from "../models/dbShema.js";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";

// simulating home page
const homeBoard = (req, res) => {
  res.send("Welcome to the home page");
};

// update profile
const updateProfile = async (req, res) => {
  let userNewEmail = req.body.email;
  console.log("req.userId:", userNewEmail);
  try {
    if (userNewEmail) {
      let user = await UserModel.findById(req.query.userID);
      console.log(user);
      user.email = userNewEmail;
      let saveUser = await user.save();
      console.log(saveUser);
      let token = jwt.sign({ id: req.userID }, jwtConfig, {
        expiresIn: 86400, // 24hours
      });
      res.json({
        status: true,
        message: {
          id: saveUser._id,
          email: saveUser.email,
          roles: saveUser.roles,
          accessToken: token,
        },
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ message: err.message });
  }
};

export { updateProfile, homeBoard };
