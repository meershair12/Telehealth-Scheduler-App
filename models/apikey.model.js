
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

const ApiKey = sequelize.define(
  "ApiKey",
  {
    keyValue: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true, // Optional: you can link it to a User later
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "api_keys",
    timestamps: true,
  }
);

// Helper to generate a new random API key
ApiKey.generateKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = ApiKey;
