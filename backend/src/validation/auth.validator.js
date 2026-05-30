import {body, validationResult} from "express-validator";


export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const registerValidation = [
  body('username').trim().notEmpty()
  .withMessage('Username is required').isLength({min: 3, max: 30}).withMessage('Username must be between 3 and 30 characters').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .withMessage(
    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
  ),
  validate
]

