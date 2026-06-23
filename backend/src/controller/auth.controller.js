import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


/**
 * 
 * @des register a new user 
 * @routes Post /api/auth/register
 * @access Public
 * @body {username, email, password}
 */
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

const emailVerificationToken = jwt.sign({
   email: user.email,
    }, process.env.JWT_SECRET,{
      expiresIn: "1d",
    } )

await sendEmail({
  to: email,
  subject: "Welcome to Perplexiy!",
  html: `<h1>Welcome to Perplexiy, ${username}!</h1><p>Thank you for registering. We're excited to have you on board.</p>
  <p>Please verify your email address by clicking the link below:</p>
  <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
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


/**
 * @route Post /api/auth/resendEmailVerification
 * @desc Resend email verification link to the user
 * @access Public
 * @body { email }
 */
export async function resendEmailVerification(req, res) {
  const {email} = req.body;

  const user = await userModel.findOne({email}); 

    if (!user) {
      return res.status(400).json({
        message: "Email is not Found",
        success: false,
        err: "Please provide a valid email address",
      });
    }

    if(user.verified) {
    return res.status(400).json({
      message: "Email is already verified",
      success: false,
      err: "Your email address is already verified, you can log in to your account",
    });
    }

   

    if(user.lastVerificationEmailSentAt) {

const diff = Date.now() - user.lastVerificationEmailSentAt.getTime();


if (diff < 60000) {
  return res.status(429).json({
    message: "please wait 1 minute",
    success: false,
    err: "Please wait before requesting another verification email",
  });
}

    }





    const emailVerificationToken = jwt.sign({
      email: user.email,
       }, process.env.JWT_SECRET,{
         expiresIn: "1d",
       } )



   await sendEmail({
     to: email,
     subject: "Welcome to Perplexiy!",
     html: `<h1>Welcome to Perplexiy, ${user.username}!</h1><p>Thank you for Re registering. We're excited to have you on board.</p>
  <p>Please verify your email address by clicking the link below:</p>
  <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
  <br>
  <p>Best Regards</p>
  <p>Team perplexiy</p>`,
     text: `Welcome to Perplexiy, ${user.username}! Thank you for registering.<br> We're excited to have you on board.`,
   });
  

 user.lastVerificationEmailSentAt = new Date();
 await user.save();
    
   res.status(200).json({
     message: "Verification email resent successfully",
     success: true,
     data: {
       id: user._id,
       username: user.username,
       email: user.email,
     },
   });

    }


/**
 * @description login user and return JWT token
 * @route Post /api/auth/login
 * @access Public
 */
export async function login(req, res) {
  const {email, password} = req.body;

  const user = await userModel.findOne({email})

  if(!user){
    return res.status(400).json({
      message:"Email not found",
      success: false,
      err:"invalid email"
    })
  }

const isPasswordMatch = await user.comparePassword(password);

if(!isPasswordMatch) {
  return res.status(400).json({
    message: "Invalid password",
    success: false,
    err: "Incorrect password"
  })
}

if(!user.verified) {
  return res.status(400).json({
    message: "Email not verified",
    success: false,
    err: "Please verify your email address before logging in"
  })
}

const token = jwt.sign({
  id: user._id,
  username: user.username,
}, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

res.cookie("token", token)

res.status(200).json({
  message: "Login successful",
  success: true,
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
  },
})
}

/** 
 * @description verify user's email address
 * @route Get /api/auth/verify-email
 * @access Private
 */
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

res.status(200).json({
  message: "User fetched successfully",
  success: true,
  user: user, 

   });
}

/**
 * 
 * @des verify user's email address
 * @routes Get /api/auth/verify-email
 * @access Public
 * @query {token}
 */
export async function verifyEmail(req, res) {
  const token = req.query.token;

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      err: "User not found",
    });
  }

  user.verified = true;
  await user.save();

  const html = `<h1>Email Verified</h1><p>Thank you for verifying your email address. Your account is now active.</p>
 <p>You can now log in to your account and start using Perplexity.</p>
 <br>
 <a href="http://localhost:3000/login">Go to Login</a>
 <br>
 <p>Best Regards</p>
 <p>Team perplexiy</p>`;

  return res.send(html);
} catch (err) {
  return res.status(400).json({
    message: "Invalid or expired token",
    success: false,
    err: "link expired",
  });
}
}

