const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const TelehealthProvider = sequelize.define("TelehealthProvider", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  suffix: {
    type: DataTypes.ENUM("Dr.", "MD", "CNRP", "DO", "NP", "PA"),
    allowNull: false,
    defaultValue: "Dr."
  },
  stateLicenses: {
    type: DataTypes.JSON, // Array of state codes e.g. ["AL","TX","FL"]
    allowNull: false,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active',
  },
}, {
  tableName: "telehealth_providers",
  timestamps: true
});




module.exports = TelehealthProvider;
