// models/User.js

const { DataTypes, ENUM } = require('sequelize');
const sequelize = require('../config/db'); // your sequelize instance
const bcrypt = require('bcrypt');
const Availability = require('./scheduler.model');
const Reservation = require('./reservation.model');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50],
    },
  },
 email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: true,
    notEmpty: true,
    is: {
      args: /^[A-Za-z0-9._%+-]+@(personichealth\.com|WoundMdhealth\.com|marathonsupport\.com)$/i,
      msg: 'Only @personichealth.com, @WoundMdhealth.com, or @marathonsupport.com emails are allowed.',
    },
  },
},
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100], // minimum password length
    },
  },
  privilege: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['CDS', 'PCC', 'DSS', 'PCM', 'superadmin']], // example roles
    },
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null, // 
  },
  lastLoginIP: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    allowNull: false,
    defaultValue: 'Active',
  },
  accountVerificationStatus: {
    type: DataTypes.ENUM('verified', 'pending_verification', 'not_verified'),
    allowNull: false,
    defaultValue: 'pending_verification',
  },
  profile: {
    type: DataTypes.STRING, // URL of profile picture
    allowNull: true,
    defaultValue: null,
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActionRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
  },
  is2FAEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isSetupComplete: {
    type: ENUM("initial","middle","almost","completed","refused"),
    defaultValue: "initial",
  },
  deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null, },
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});


User.hasMany(Availability, { as: "confirmedSlots", foreignKey: "confirmedBy" });
User.hasMany(Availability, { as: "reservedSlots", foreignKey: "reservedBy" });

// Instance method to compare password
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


User.hasMany(Reservation, { foreignKey: "confirmedId", as: "confirmedReservations" });
Reservation.belongsTo(User, { foreignKey: "confirmedId", as: "confirmedUser" });
User.hasMany(Reservation, { foreignKey: "reservedBy", as: "madeReservations" });
Reservation.belongsTo(User, { foreignKey: "reservedBy", as: "reservedUser" });


module.exports = User;
