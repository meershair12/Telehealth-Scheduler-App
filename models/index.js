

const sequelize = require("../config/db");
const State = require("./states.model");
const Provider = require("./provider.model");
const User = require("./user.model");
const Scheduler = require("./scheduler.model");
const Availability = require("./scheduler.model");

// Yahan aap aur models add kar sakte ho future me
const db = {};
db.sequelize = sequelize;
db.State = State;
db.Provider = Provider;
db.User = User;
db.Scheduler = Scheduler;


// Associations
Availability.belongsTo(User, { as: "confirmedUser", foreignKey: "confirmedBy" });
Availability.belongsTo(User, { as: "reservedUser", foreignKey: "reservedBy" });
// 
const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");
    await sequelize.sync({force:false, alter:false}); // Sync all models
    console.log("✅ All models synced.");
  } catch (err) {
    console.error("❌ Database sync failed:", err.message);
  }
};

db.sync = syncDB;

module.exports = db;
