// models/ReservationComment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // apni db config ka path sahi karna
const User = require("./user.model");

const ReservationComment = sequelize.define("ReservationComment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  reservationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Reservations", // table name ya model name
      key: "id",
    },
    onDelete: "CASCADE",
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },

  parentCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "ReservationComments",
      key: "id",
    },
    onDelete: "CASCADE", // agar parent delete ho to replies bhi delete
  },

  type: {
    type: DataTypes.ENUM("main", "reply"),
    allowNull: false,
    defaultValue: "main",
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});


ReservationComment.belongsTo(User, { foreignKey: "userId", as: "author" });


module.exports = ReservationComment;
