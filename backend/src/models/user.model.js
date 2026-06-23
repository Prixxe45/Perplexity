import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Password is required"],
    unique: [true, "Email must be Unique"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  lastVerificationEmailSentAt: {
    type: Date,
    default: null,
  }
},{
  timestamps: true,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return ;
  }
  this.password = await bcrypt.hash(this.password, 10);
 
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}

const userModel = mongoose.model("users", userSchema);

export default userModel;
