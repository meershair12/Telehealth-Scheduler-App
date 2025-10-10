//////////////////////
// models/auditLog.js
//////////////////////
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AuditLog extends Model {
        static associate(models) {
            AuditLog.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId',
            });
        }
    }

    AuditLog.init({
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        tableName: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        recordId: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        previousData: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        newData: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'AuditLog',
        tableName: 'audit_logs',
        timestamps: true,
    });

    return AuditLog;
};



////////////////////////////
// routes/auditRoutes.js
////////////////////////////
const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

// Example middleware (optional) to attach user info
// router.use(authMiddleware);

// Create a new log manually
// router.post('/', auditController.createLog);

// Fetch all logs
router.get('/', auditController.getAllLogs);

// Fetch logs for a specific user
router.get('/user/:userId', auditController.getUserLogs);

// Delete a specific log
// router.delete('/:id', auditController.deleteLog);

module.exports = router;
