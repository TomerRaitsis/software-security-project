import { UserModel } from "../models/dbSchema.js";

// Simulate admin board
const adminBoard = (req, res) => {
  res.send("welcome to the Admin Board");
};


// Add supervisor role to a user
const addSupervisor = async (req, res) => {
  let userToSupervisor = req.body.email;
  console.log("req.body:", req.body);
  try {
    let user = await UserModel.findOne({ email: userToSupervisor });
    console.log(user);
    // If the user exists and does not already have the supervisor role
    if (user && !user.roles.includes("ROLE_SUPERVISOR")) {
      user.roles = ["ROLE_SUPERVISOR"];
      let saveUser = await user.save();
      console.log(saveUser);
      // Fetch all users to return the updated list
      let allUsers = await UserModel.find();
      res.json(allUsers);
    }
  } catch (err) {
    console.log(err.message);
    res.json({ error: err.message });
  }
};

// Remove supervisor role from a user
const removeSupervisor = async (req, res) => {
  let supervisorToUser = req.body.email;
  try {
    let user = await UserModel.findOne({ email: supervisorToUser });
    console.log(user);
    // If the user exists and has the supervisor role
    if (user && user.roles.includes("ROLE_SUPERVISOR")) {
      user.roles = ["ROLE_USER"];
      let saveUser = await user.save();
      console.log(saveUser);
      // Fetch all users to return the updated list
      let users = await UserModel.find();
      res.json(users);
    }
  } catch (err) {
    console.log(err.message);
    res.json({ error: err.message });
  }
};

export { adminBoard, removeSupervisor, addSupervisor };
