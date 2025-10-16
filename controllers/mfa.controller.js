const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { getFullForm } = require("./privilliges.controller");
const { BASE_URL } = require("../config/URL");

const setupAuthenticatorMFA =  async (req, res) => {
   
  try {



      if (req.user.id !== parseInt(req.params.id))
        return res.status(403).json({ message: "Unauthorized to enable 2FA for another user" });


    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = speakeasy.generateSecret({
      name: "Telehealth Scheduler",
      
    });

    user.twoFactorSecret = secret.base32;
    // user.is2FAEnabled = true;
    await user.save();

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    res.json({ qrCode });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}

const verifyAuthenticatorOTP = async (req, res) => {
  try {
    const {  code,resource } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    
    const verified = speakeasy.totp.verify({
      secret: user?.twoFactorSecret,
      encoding: "base32",
      token:code,
      window: 1,
    });

    if (!verified) return res.status(400).json({ message: "Invalid OTP" });

    // const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    if(resource=="login"){

       
  // Create your app JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, privilege: user.privilege },
    process.env.JWT_SECRET || "5e555416fe2bbb900f857d1e2edd89eb",
    { expiresIn: "24h" }
  );

  
  
  return res.json({
    message: "2FA success",
    redirectUrl: BASE_URL,
    token:token,
    user:{  
      id: user.id,
      profile: user.profile,
      username: user.username,
      fullName: user.firstName + " " + user.lastName,
      email: user.email,
      role: user.privilege,
             roleFullForm: user.designation ? user.designation : getFullForm(user.privilege),

      lastLoginAt: user.lastLoginAt,
      lastLoginIP: user.lastLoginIP,
    
    }
  });
    }

    user.is2FAEnabled = true;
    await user.save();
    res.json({ message: "2FA success", token: verified });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}

module.exports = {setupAuthenticatorMFA,verifyAuthenticatorOTP}