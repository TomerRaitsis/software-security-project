import mongoose from "mongoose";

// Validate email format using regex
var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

//creating user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validateEmail, "Please fill a valid email address"], // Custom validation for email format
  },
  password: {
    type: String,
    required: true,
  },
  roles: { type: Array, default: ["ROLE_USER"] },
});

// creating User model
const UserModel = mongoose.model("UserModel", userSchema);
export { UserModel };

