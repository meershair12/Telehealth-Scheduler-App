module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
        detail: "Missing or invalid Authorization header",
        status: "401"
      });
    }

    const token = authHeader.split(" ")[1];

    // Compare with SCIM token stored in environment variable
    if (token !== process.env.SCIM_TOKEN) {
      return res.status(403).json({
        schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
        detail: "Invalid or inactive SCIM token",
        status: "403"
      });
    }

    next();
  } catch (err) {
    console.error("SCIM token validation error:", err);
    res.status(500).json({
      schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
      detail: "Internal server error",
      status: "500"
    });
  }
};
