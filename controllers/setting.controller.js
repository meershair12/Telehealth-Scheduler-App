const {  User, setting } = require("../models");
const Setting = require("../models/settings.model");

// ✅ Get settings for a specific user
exports.getSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const settings = await setting.findOne({ where: { userId } });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found for this user" });
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Create or update user settings
exports.saveSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await user.update({isSetupComplete:"completed"})
    // Update if exists, else create
    
    const setting = await Setting.findOne({where:{userId:userId}});
    if(setting){

      const [settings, created] = await Setting.update({ ...data },{where:{userId:user.id}});
      res.status(200).json({
        message: created ? "Settings created successfully" : "Settings updated successfully",
        settings,
      });
    }else{
      await Setting.create({...data, userId:userId})
      res.status(200).json({
        message:"Settings created successfully"
      })
    }

  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ (Optional) Reset to defaults
exports.resetSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const settings = await Setting.findOne({ where: { userId } });
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    await settings.update({
      theme: "system",
      timezone: "UTC",
      language: "en",
      notificationsEnabled: true,
      colorScheme: "blue",
      fontSize: "medium",
      layoutStyle: "comfortable",
    });

    res.status(200).json({ message: "Settings reset to default", settings });
  } catch (error) {
    console.error("Error resetting settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
