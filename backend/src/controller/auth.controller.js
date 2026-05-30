import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {

const {username,email,password} = req.body;

const isUserExist = await userModel.findOne({
  $or: [{ email }, { username }],
});

if (isUserExist) {
  return res.status(400).json({ 
    message: "User already exists",
    success: false,
    err: "User with this email or username already exists",
     });
}

const user = await userModel.create({username, email, password})

await sendEmail({
  to: email,
  subject: "Welcome to Perplexiy!",
  html: `<h1>Welcome to Perplexiy, ${username}!</h1><p>Thank you for registering. We're excited to have you on board.</p>
  <br>
  <p>Best Regards</p>
  <p>Team perplexiy</p>`,
  text: `Welcome to Perplexiy, ${username}! Thank you for registering.<br> We're excited to have you on board.`,
});

res.status(201).json({
  message: "User registered successfully",
  success: true,
  data: {
    id:user._id,
    username: user.username,
    email: user.email,
  }
})

}