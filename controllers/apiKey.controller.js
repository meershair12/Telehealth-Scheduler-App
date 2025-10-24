const ApiKey = require("../models/apikey.model");
const { USER_ROLE } = require("./privilliges.controller");
const { unAuthorizedAccessResponse } = require("../Utils/services");

// Generate new API key
exports.createApiKey = async (req, res) => {
  try {


    if (![USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) return res.status(401).json(unAuthorizedAccessResponse)
    const { description, createdBy } = req.body;
    const keyValue = ApiKey.generateKey();

    const newKey = await ApiKey.create({
      keyValue,
      description,
      createdBy,
    });

    res.status(201).json({
      message: "API key created successfully",
      apiKey: newKey.keyValue,
    });
  } catch (err) {
    console.error("Error creating API key:", err);
    res.status(500).json({ message: err.message });
  }
};
// Regenerate new API key
exports.recreateApiKey = async (req, res) => {
  try {

    if (![USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) return res.status(401).json(unAuthorizedAccessResponse)
    const keyValue = ApiKey.generateKey();

    const { id } = req.params;
    const key = await ApiKey.findByPk(id);
    if (!key) return res.status(404).json({ error: "API key not found" });

    key.keyValue = keyValue;
    await key.save();

    res.status(201).json({
      message: "API key regenerated successfully",
      apiKey: keyValue,
    });
  } catch (err) {
    console.error("Error re-creating API key:", err);
    res.status(500).json({ message: err.message });
  }
};




// Get all keys
exports.getAllKeys = async (req, res) => {
  try {
    if (![USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) return res.status(401).json(unAuthorizedAccessResponse)
    const keys = await ApiKey.findAll({
      attributes: ["id", "description", "isActive", "createdAt", "lastUsedAt", ["keyVaLue", "key"]],
    });
    res.json(keys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Deactivate a key
exports.deactivateKey = async (req, res) => {
  try {
    if (![USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) return res.status(401).json(unAuthorizedAccessResponse)
    const { id } = req.params;
    const key = await ApiKey.findByPk(id);
    if (!key) return res.status(404).json({ error: "API key not found" });

    key.isActive = false;
    await key.save();

    res.json({ message: "API key deactivated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Deactivate a key
exports.activateKey = async (req, res) => {
  try {
    if (![USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) return res.status(401).json(unAuthorizedAccessResponse)
    const { id } = req.params;
    const key = await ApiKey.findByPk(id);
    if (!key) return res.status(404).json({ error: "API key not found" });

    key.isActive = true;
    await key.save();

    res.json({ message: "API key deactivated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete a key
exports.deleteKey = async (req, res) => {
  try {
 
    if (![USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) return res.status(401).json(unAuthorizedAccessResponse)
    const { id } = req.params;
    const key = await ApiKey.findByPk(id);
    if (!key) return res.status(404).json({ error: "API key not found" });

    
    await key.destroy();

    res.json({ message: "API key deleted  successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
