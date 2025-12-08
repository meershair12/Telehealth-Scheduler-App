const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { getFullForm } = require("./privilliges.controller");
const { BASE_URL } = require("../config/URL");
// const FRONTEND_URL = "http://localhost:5173";
// const FRONTEND_URL = "http://localhost:3000";




// --- CONTROLLERS ---

// Step 1: Redirect to Mock Provider
const startSSO = (req, res) => {
  const returnUrl = `${BASE_URL}`;
  return res.redirect(`/api/auth/mock-provider?returnUrl=${encodeURIComponent(returnUrl)}`);
};

// Step 2: Simulate an IdP (like Azure)
const mockProvider = (req, res) => {
  const { returnUrl } = req.query;

  const fakeUser = { id: "u-1001", email: "smuhammad@personichealth.com", displayName: "Ali Khan" };
  // const fakeUser = { id: "u-1001", email: "muhammmadzaheer5@gmail.com", displayName: "Ali Khan" };
  const fakeAccessToken = Buffer.from(
    JSON.stringify({ sub: fakeUser.id, email: fakeUser.email })
  ).toString("base64");


  const redirectTo = `/api/auth/sso/callback?access_token=${encodeURIComponent(
    fakeAccessToken
  )}&email=${encodeURIComponent(fakeUser.email)}&returnUrl=${encodeURIComponent(returnUrl)}`;

  return res.redirect(redirectTo);
};

// Step 3: Callback from IdP
const ssoCallback = async (req, res) => {
  const { access_token, email, returnUrl } = req.query;

  if (!access_token || !email) {
    return res.status(400).send("Missing token or email from provider");
  }

  // Decode and verify fake token
  let providerPayload = null;
  try {
    const decoded = Buffer.from(access_token, "base64").toString("utf8");
    providerPayload = JSON.parse(decoded);
  } catch (err) {
    return res.status(400).send("Invalid provider token");
  }

  const simulatedAccountEnabled = !email.includes("disabled");
  if (!simulatedAccountEnabled) {
    return res.redirect(`${returnUrl}?sso=denied&reason=account_disabled`);
  }

  // Check user from DB
  const user = await User.findOne({ where: { email, status: "active" } });
  if (!user) {
    return res.redirect(`${returnUrl}?sso=denied&reason=user_not_found`);
  }
  await user.update({
    lastLoginAt: new Date(),
    lastLoginIP: req.ip || req.connection.remoteAddress || null,
  });
  user.save()

  // Create your app JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, privilege: user.privilege },
    process.env.JWT_SECRET || "supersecretkey",
    { expiresIn: "24h" }
  );


  // Store cookies
  res.cookie("token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.cookie(
    "user",
    JSON.stringify({
      id: user.id,
      profile: user.profile,
      username: user.username,
      fullName: user.firstName + " " + user.lastName,
      email: user.email,
      role: user.privilege,
      roleFullForm: user.designation ? user.designation : getFullForm(user.privilege),
      isSetupComplete: user.isSetupComplete,
      lastLoginAt: user.lastLoginAt,
      lastLoginIP: user.lastLoginIP,
    }),
    {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    }
  );

  return res.redirect(`${returnUrl}?sso=success`);
};


module.exports = { startSSO, ssoCallback, mockProvider }
