
const express = require("express");
const router = express.Router();
const scimController = require("../controllers/scim.controller");
const apiKeyAuth = require("../middlewares/apiKeyAuth");

// ✅ Secure with Bearer token (same as in Azure AD Provisioning)

router.use(apiKeyAuth);

router.get('/ServiceProviderConfig', (req, res) => {
  res.setHeader('Content-Type', 'application/scim+json');
  res.json({
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig"],
    id: "ServiceProviderConfig",
    patch: { supported: true },
    bulk: { supported: false },
    filter: { supported: true, maxResults: 200 },
    changePassword: { supported: false },
    sort: { supported: true },
    etag: { supported: false },
    meta: {
      resourceType: "ServiceProviderConfig",
      location: "/scim/v2/ServiceProviderConfig"
    }
  });
});


router.post("/Users", scimController.createUser);
router.patch("/Users/:id", scimController.updateUser);
router.delete("/Users/:id", scimController.deleteUser);

module.exports = router;

