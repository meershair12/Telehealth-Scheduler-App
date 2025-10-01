// models/reservation.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// other models import karo (agar banaye hue hain)
const State = require("./states.model");
const Availability = require("./scheduler.model");
const TelehealthProvider = require("./provider.model");
const User = require("./user.model");

const Reservation = sequelize.define("Reservation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "states",
      key: "id",
    },
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "telehealth_providers",
      key: "id",
    },
  },
  availabilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "availability",
      key: "id",
    },
  },
  reservedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  confirmedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reasonOfCancellation: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  timezone: { type: DataTypes.ENUM('EST', 'CST',"MST","PST","AKST","HST",""), defaultValue: '' },
  isCancelled: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: "no",
  },
  status: {
    type: DataTypes.ENUM("reserved", "confirmed","cancelled","missed","completed"),
    allowNull: false,
    defaultValue: "reserved",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "reservations",
  timestamps: true,
});

// 🔗 Associations
Reservation.belongsTo(State, { foreignKey: "stateId", as: "state" });
// Reservation.belongsTo(TelehealthProvider, { foreignKey: "providerId", as: "provider" });
// Reservation.belongsTo(Availability, { foreignKey: "availabilityId", as: "availability" });
// Reservation.belongsTo(User, { foreignKey: "reservedBy", as: "reservedUser" });
// Reservation.belongsTo(User, { foreignKey: "confirmedId", as: "confirmedUser" });




module.exports = Reservation;
