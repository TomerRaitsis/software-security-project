import { UserModel } from "../models/dbShema.js";

// simulating admin board
const adminBoard = (req, res) => {
  res.send("welcome to the Admin Board");
};


// add new supervisor role
const addSupervisor = async (req, res) => {
  let userToSupervisor = req.body.email;
  console.log("req.body:", req.body);
  try {
    let user = await UserModel.findOne({ email: userToSupervisor });
    console.log(user);
    if (user && !user.roles.includes("ROLE_SUPERVISOR")) {
      user.roles = ["ROLE_SUPERVISOR"];
      let saveUser = await user.save();
      console.log(saveUser);
      let allUsers = await UserModel.find();

      res.json(allUsers);
    }
  } catch (err) {
    console.log(err.message);
    res.json({ error: err.message });
  }
};

// remove supervisor role
const removeSupervisor = async (req, res) => {
  let supervisorToUser = req.body.email;
  try {
    let user = await UserModel.findOne({ email: supervisorToUser });
    console.log(user);
    if (user && user.roles.includes("ROLE_SUPERVISOR")) {
      user.roles = ["ROLE_USER"];
      let saveUser = await user.save();
      console.log(saveUser);
      let users = await UserModel.find();

      res.json(users);
    }
  } catch (err) {
    console.log(err.message);
    res.json({ error: err.message });
  }
};

export {adminBoard, removeSupervisor, addSupervisor};
