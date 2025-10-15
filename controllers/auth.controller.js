const AuthUser = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loginAttempts, MAX_ATTEMPTS, BLOCK_DURATION, blockedIPs } = require("../middlewares/auth");
const { getFullForm, USER_ROLES, USER_ROLE } = require("./privilliges.controller");
const { AccessControl, unAuthorizedAccessResponse, maskEmail } = require("../Utils/services");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
// const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } = require("../smtp/auth.mail.template");
const crypto = require('crypto');
const { BASE_URL } = require("../config/URL");
const { generatePassword } = require("../Utils/generate-password");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, privilege, firstName, lastName } = req.body;

    const password = generatePassword()
     if(![USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) return res.status(401).json(unAuthorizedAccessResponse)
    // Check if username or email already exists
    const existingUser = await AuthUser.findOne({
      where: { username }
    });
    const existingEmail = await AuthUser.findOne({
      where: { email }
    });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    const token = crypto.randomBytes(20).toString("hex");
    
    const resetTokenExpire = dayjs().add(10, "minute").toDate();



    // const resetLink = `${BASE_URL}/invitation/setup/${token}`;

    const user = await AuthUser.create({ username, email, password, privilege, firstName, lastName, resetToken: token, resetTokenExpire });

    // await sendWelcomeEmail(user.email, user, resetLink)

    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username, fullName: user.firstName + " " + user.lastName, email: user.email, privilege: user.privilege } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Login user
exports.login = async (req, res) => {
  const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    const { email, password } = req.credentials;

    const user = await AuthUser.findOne({ where: { email, status: "active" } });
    // if (!user) return res.status(404).json({ type:"login_failed",message: 'User not found' });
    if (!user) return res.status(200).json({ type: "login_failed", message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(200).json({ type: "login_failed", message: 'Invalid credentials' });


    // const ptop = this.optSend(req,res)
    if (user?.isActionRequired || user.accountVerificationStatus == "pending_verification") {


      await this.optSend(req, res)

      // await sendOTPEmail(email,)
      return res.status(200).json({
        status: "verify-accuont",
        redirect: '/verify-your-account/',
        email: maskEmail(email)
      })
    }
    if (user?.is2FAEnabled) {

      return res.status(200).json({
        status: "two-factor",
        redirect: '/two-factor/',
        userId: user.id
      })
    }

    // Update last login details
    await user.update({
      lastLoginAt: new Date(),
      lastLoginIP: req.ip || req.connection.remoteAddress || null,
    });


    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, privilege: user.privilege },
      process.env.JWT_SECRET || '5e555416fe2bbb900f857d1e2edd89eb',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      profile: {
        id: user.id,
        profile: user.profile,
        username: user.username,
        fullName: user.firstName + " " + user.lastName,
        email: user.email,
        role: user.privilege,
        roleFullForm: getFullForm(user.privilege),
        lastLoginAt: user.lastLoginAt,
        lastLoginIP: user.lastLoginIP,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
const otpStore = {}
exports.optSend = async (req, res) => {
  try {
    const { email } = req.body;


    if (!email) return res.status(400).json({ message: "Email required" });

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiry
    otpStore[email] = {
      otp,
      expires: dayjs().add(5, "minutes").toISOString(),
    };

    // await sendOTPEmail(email, otp, email)

    return { success: true, message: "OTP sent successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to send OTP", error: err.message };
  }
}


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: "No OTP found for this email" });

  if (dayjs().isAfter(dayjs(record.expires)))
    return res.status(400).json({ message: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP, Please try again." });

  // success — mark user verified in DB
  delete otpStore[email];

  const user = await AuthUser.findOne({ where: { email, status: "active" } });

  await user.update({
    isActionRequired: 0,
    accountVerificationStatus: "verified",
    lastLoginAt: new Date(),
    lastLoginIP: req.ip || req.connection.remoteAddress || null,
  });

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, privilege: user.privilege },
    process.env.JWT_SECRET || '5e555416fe2bbb900f857d1e2edd89eb',
    { expiresIn: '24h' }
  );

  res.status(200).json({
    message: 'Verification successful',
    token,
    profile: {
      id: user.id,
      profile: user.profile,
      username: user.username,
      fullName: user.firstName + " " + user.lastName,
      email: user.email,
      role: user.privilege,
      roleFullForm: getFullForm(user.privilege),
      lastLoginAt: user.lastLoginAt,
      lastLoginIP: user.lastLoginIP,
    },
  });


};

exports.getSettings = async (req, res) => {
  try {
    const user = await AuthUser.findByPk(req.user.id, { attributes: ['id', 'username', 'email', 'privilege', "is2FAEnabled"] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await AuthUser.findByPk(req.user.id, { attributes: ['id', 'username', 'email', 'privilege',"firstName","lastName","lastLoginAt","lastLoginIP","profile"] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      message: 'Login successful',
      profile: {
        id: user.id,
        profile: user.profile,
        username: user.username,
        fullName: user.firstName + " " + user.lastName,
        email: user.email,
        role: user.privilege,
        roleFullForm: getFullForm(user.privilege),
        lastLoginAt: user.lastLoginAt,
        lastLoginIP: user.lastLoginIP,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.checkToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: false, type: "no_token", message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '5e555416fe2bbb900f857d1e2edd89eb');
    req.user = decoded; // contains id, username, privilege
    return res.json({ status: true })
  } catch (error) {
    return res.status(401).json({ status: false, type: "invalid_token", message: 'Unauthorized: Invalid token' });
  }
};




exports.getAllUsers = async (req, res) => {

  try {

    if (!AccessControl.allUsers(req.user, res, USER_ROLES)) return res.status(401).json({ error: "unaothorized access" })

    if (AccessControl.authorizeByPrivileges(["superadmin"], req.user)) {
      const users = await AuthUser.findAll({
        attributes: {
          exclude: "password"
        }
      });
      res.status(200).json(users);
    }
    else if (AccessControl.authorizeByPrivileges(["PCM"], req.user)) {

      const users = await AuthUser.findAll({
        where: {
          privilege: { [Op.in]: ["PCM", "CDS", "PCC", "DSS"] },
          status: "active"
        },
        attributes: {
          exclude: "password"
        }
      });
      res.status(200).json(users);
    }
    else if (AccessControl.authorizeByPrivileges(["PCC", "CDS", "DSS", "PCM"], req.user)) {
      const users = await AuthUser.findAll({
        where: {
          privilege: req.user.privilege,
          status: "active"
        }
      });
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await AuthUser.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetTokenExpire = dayjs().add(10, "minute").toDate();

  await user.save();

  const resetLink = `${BASE_URL}/reset-password/${token}`;
  // await sendPasswordResetEmail(user.email, resetLink, `${user.firstName} ${user.lastName}`)
  // await sendEmail(email, "Password Reset", `<a href="${resetLink}">Reset your password</a>`);
  res.json({ message: "Reset link sent to email",  isResetLinkSent: true });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await AuthUser.findOne({ where: { resetToken: token } });
  if (!user || user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = password;
  user.resetToken = null;
  user.resetTokenExpire = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};


exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;


    const user = await AuthUser.findOne({ where: { resetToken: token } });

    if (!user) {
      return res.status(400).json({ valid: false, message: "Invalid token" });
    }

    if (user.resetTokenExpire < Date.now()) {
      return res.status(400).json({ valid: false, message: "Token expired" });
    }

    return res.json({ valid: true, message: "Token is valid" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, message: "Server error" });
  }
};
