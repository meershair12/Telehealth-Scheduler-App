const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Setting = sequelize.define("Setting", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  theme: { type: DataTypes.ENUM("light", "dark", "system"), defaultValue: "system" },
  layoutStyle: { type: DataTypes.ENUM("compact", "comfortable"), defaultValue: "comfortable" },
  sidebarCollapsed: { type: DataTypes.BOOLEAN, defaultValue: false },

  timezone: { type: DataTypes.ENUM('EST', 'CST',"MST","PST","AKST","HST",""), defaultValue: "EST" },
  language: { type: DataTypes.STRING, defaultValue: "en" },
  dateFormat: { type: DataTypes.STRING, defaultValue: "YYYY-MM-DD" },
  timeFormat: { type: DataTypes.ENUM("12h", "24h"), defaultValue: "24h" },
 
  notificationsEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  emailNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
  smsNotifications: { type: DataTypes.BOOLEAN, defaultValue: false },
  pushNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },

  twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  showOnlineStatus: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastSeenVisible: { type: DataTypes.BOOLEAN, defaultValue: true },

  autoSave: { type: DataTypes.BOOLEAN, defaultValue: true },
  defaultView: { type: DataTypes.STRING, defaultValue: "dashboard" },
  sessionTimeout: { type: DataTypes.INTEGER, defaultValue: 30 },
  rememberDevice: { type: DataTypes.BOOLEAN, defaultValue: true },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
    onDelete: "CASCADE",
  },
});



module.exports = Setting;
