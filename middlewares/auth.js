const fs = require("fs")
const jwt = require('jsonwebtoken');

const loginAttempts = {};
const blockedIPs = {};

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes


const User = require("../models/user.model"); // apna User model import karo
const { privateDecrypt } = require('crypto');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      type: "no_token",
      message: "Unauthorized: No token provided",
      redirectTo: "/login" // frontend ko redirect karne ke liye
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "5e555416fe2bbb900f857d1e2edd89eb");

    // DB se user fetch karo
    const user = await User.findOne({
      where: { status: 'active',id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        type: "user_not_found",
        message: "Unauthorized: User does not exist or may be deactivated or susspended",
        redirectTo: "/contact-admin" // frontend ko redirect karne ke liye
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        status: false,
        type: "user_blocked",
        message: "Access denied: User is blocked",
        redirectTo: "/contact-admin" // frontend ko redirect karne ke liye
      });
    }

    // request ke sath user attach karo
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      status: false,
      type: "invalid_token",
      message: error.message || "Unauthorized: Invalid token",
      redirectTo: "/login" // frontend ko redirect karne ke liye

    });
  }
};

const PRIVATE_KEY = fs.readFileSync('./keys/rsa_private.pem', 'utf8');

function base64ToBuffer(b64) {
  return Buffer.from(b64, 'base64');
}

const credentialDecryption = (req,res,next)=>{
  try {
    

     const { email, password_enc } = req.body;
    if (!email || !password_enc) return res.status(400).send('Missing');

    // decrypt
    const encryptedBuf = base64ToBuffer(password_enc);
    const decryptedBuf = privateDecrypt(
      {
        key: PRIVATE_KEY,
        padding: require('crypto').constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      encryptedBuf
    );
    const password = decryptedBuf.toString('utf8');
    
    req.credentials  = {email,password}
    next()
  } catch (error) {
        console.error(err);
    res.status(500).json(error);

  }

}

module.exports  ={loginAttempts,blockedIPs,MAX_ATTEMPTS,BLOCK_DURATION,protect,credentialDecryption}