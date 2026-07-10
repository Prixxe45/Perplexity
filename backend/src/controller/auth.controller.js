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
  subject: "Welcome to Paper-Ai",
  html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
  <h2>Welcome to Paper-AI 🎉</h2>

  <p>Hi ${username},</p>

  <p>
    Thank you for creating an account with Paper-AI.
    To complete your registration, please verify your email address.
  </p>

  <div style="margin: 30px 0;">
    <a
      href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}"
      style="
        background-color: #2563eb;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        display: inline-block;
      "
    >
      Verify Email
    </a>
  </div>

  <p>
    If you did not create this account, you can safely ignore this email.
  </p>

  <hr style="margin: 24px 0;" />

  <p style="font-size: 12px; color: #666;">
    This is an automated email from Paper-AI. Please do not reply to this message.
  </p>

  <p>
    Regards,<br />
    <strong>Paper-AI Team</strong>
  </p>
</div>
`,
  text: `
Welcome to Paper-AI!

Hi ${username},

Thank you for creating an account with Paper-AI.

Please verify your email address using the link below:

http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}

If you did not create this account, please ignore this email.

Regards,
Paper-AI Team
`,
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

const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}`;

   await sendEmail({
     to: email,
     subject: "Verify Your Paper-AI Email Address",

     html: `
<div style="background:#f4f7fb;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <div style="text-align:center;">
      <h1 style="color:#1e3a8a;margin-bottom:10px;">Paper-AI</h1>
      <p style="color:#64748b;font-size:16px;">
        Email Verification Required
      </p>
    </div>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:25px 0;" />

    <h2 style="color:#0f172a;">
      Verify Your Email Address
    </h2>

    <p style="color:#475569;font-size:16px;line-height:1.7;">
      We noticed that your email address has not been verified yet.
      To continue using all features of Paper-AI, please verify your email address.
    </p>

    <div style="text-align:center;margin:35px 0;">
      <a
        href="${verificationLink}"
        style="
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          padding:14px 32px;
          border-radius:8px;
          font-weight:bold;
          display:inline-block;
          font-size:16px;
        "
      >
        Verify Email
      </a>
    </div>

    <p style="color:#475569;font-size:15px;line-height:1.7;">
      If the button above doesn't work, copy and paste the link below into your browser:
    </p>

    <p style="word-break:break-all;color:#2563eb;font-size:14px;">
      ${verificationLink}
    </p>

    <p style="color:#475569;font-size:15px;line-height:1.7;">
      If you did not create a Paper-AI account, you can safely ignore this email.
    </p>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0;" />

    <p style="text-align:center;color:#94a3b8;font-size:13px;">
      This is an automated email. Please do not reply.
    </p>

    <p style="text-align:center;color:#0f172a;font-weight:bold;">
      Team Paper-AI
    </p>

  </div>
</div>
`,

     text: `
Paper-AI - Email Verification

Your email address has not been verified yet.

Please verify your email by visiting the link below:

${verificationLink}

If you did not create a Paper-AI account, please ignore this email.

Team Paper-AI
`,
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

export async function logoutUser(req, res) {
const token = req.cookies.token;

res.clearCookie("token")


return res.status(200).json({
  message: "Logout successful",
  success: true
})
}

