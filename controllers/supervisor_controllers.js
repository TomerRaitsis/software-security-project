// simulating supervisor board
const supervisorBoard = (req, res) => {
  res.send("welcome to the Supervisor Board");
};
import { UserModel } from "../models/dbShema.js";

// getAllUsers
const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find({
      roles: { $nin: ["ROLE_ADMIN", "ROLE_SUPERVISOR"] },
    });
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.json({ error: err.message });
  }
};

export {supervisorBoard, getAllUsers};
