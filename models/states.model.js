
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const Reservation = require("./reservation.model");

const State = sequelize.define("State", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stateName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stateCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: "unique_state_code",
       msg: "Status code already exists" 
    },
  },
  details: {
    type: DataTypes.TEXT, // long description
    allowNull: true,
  },
  timezone: {
    type: DataTypes.ENUM("EST", "CST"),
    allowNull: false,
    defaultValue: "EST", // default timezone
    validate: {
      isIn: {
        args: [["EST", "CST"]],
        msg: "Timezone must be one of EST, CST"
      }
    }
  }
}, {
  timestamps: true,   // createdAt & updatedAt columns
  tableName: "states" // table name
})





module.exports = State;

