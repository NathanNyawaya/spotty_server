import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
import confirmToken from "../../models/Token.js";
import { verifyEmail, successfullRegistered } from "../../utils/sendEmail.js";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();

// Add session middleware before passport middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 36000, // sec
    }),
  })
);

// Initialize Passport.js and add session middleware
router.use(passport.initialize());
router.use(passport.session());

// Register new user and log them in
export const registerUser = async (req, res, next) => {
  console.log("hitting register");
  console.log(req.body);
  try {
    const { username, email, password } = req.body;

    // Check if a user with the same name or email already exists
    const existingUser = await User.findOne({
      $or: [{ userName: username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "User with the same userName or email already exists",
      });
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save the new user
      const newUser = new User({
        userName: username,
        email,
        password: hashedPassword,
        status: true,
      });

      const user = await newUser.save();
      const token = jwt.sign(
        {
          id: user._id,
          userName: user.userName,
          email: user.email,
          emailConfirm: user.emailConfirm,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      // Generate confirmation token
      // const newConfirmToken = new confirmToken({
      //   userID: user._id,
      //   confirmCode: Math.floor(100000 + Math.random() * 900000).toString(),
      // });

      // await newConfirmToken.save();
      // await verifyEmail(user.email, newConfirmToken.confirmCode);
      res.status(200).json({ token: token, message: "Success Registration" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error. Please contact support if the error persists.",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const toDelete = req.body;
    // const userId = mongoose.Types.ObjectId(toDelete._id); // Convert to ObjectId

    await User.findByIdAndDelete(toDelete.user._id);
    res.status(200).json({
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error. Please contact support if the error persists.",
    });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const checkCode = req.body.code;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const match = await confirmToken.findOne({
      userID: decoded.id,
      confirmCode: checkCode,
    });

    if (!match) {
      res.status(400).json({ message: "Invalid or Expired code" });
    }

    // Add emailConfirm: true to the token payload
    const tokenWithConfirmation = { ...decoded, emailConfirm: true };

    User.findOne({ _id: decoded.id })
      .then((user) => {
        if (user) {
          user.emailConfirm = true;
          return user.save();
        } else {
          // User not found
          throw new Error("User not found");
        }
      })
      .then((updatedUser) => {
        successfullRegistered(updatedUser.email);
        // console.log("User email confirmed:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });

    // Sign the modified token
    const modifiedToken = jwt.sign(
      tokenWithConfirmation,
      process.env.JWT_SECRET_KEY
    );

    return res
      .status(200)
      .json({ message: "Email Confirmation Success", token: modifiedToken });
  } catch (err) {
    res.status(500).json(err);
  }
};
// Configure Passport to use local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Invalid email" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
          return done(null, false, { message: "Invalid password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user for login sessions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export const loginUser = (req, res, next) => {
  console.log("login hit");
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      // Handle any error that occurred during authentication
      return res.status(200).json({
        statusCode: 500,
        message: "Server error. Please contact support if the error persists!",
      });
    }

    if (!user) {
      if (info.message === "Invalid email") {
        return res.status(200).json({
          success: false,
          statusCode: 400,
          message: "Email not registered!",
        });
      } else if (info.message === "Invalid password") {
        return res.status(200).json({
          success: false,
          statusCode: 400,
          message: "Wrong password!",
        });
      }
    }

    // Generate a JWT token with user information
    const token = jwt.sign(
      {
        id: user._id,
        username: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailConfirm: user.emailConfirm,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, { httpOnly: false, secure: false });

    // send cookie
    res.status(200).json({ token, statusCode: 200, message: "Successful" }); // send token
  })(req, res, next);
};

// Authentication middleware
export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Set the user ID in the request object for future use
    req.userId = decoded.id;
    next();
  });
};

export const logoutUser = (req, res) => {
  console.log("logout hit");

  // Clear the JWT token from the client-side (e.g., cookies, local storage)
  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully" });
};
