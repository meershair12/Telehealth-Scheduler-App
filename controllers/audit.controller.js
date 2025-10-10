////////////////////////////
// controllers/auditController.js
////////////////////////////
const { AuditLog, User } = require('../models');

exports.createLog = async (req, res) => {
    try {
        const { action, tableName, recordId, previousData, newData, description } = req.body;
        
const log = await AuditLog.create({
  userId: req.user?.id || null, // assuming req.user is set after JWT auth
  action,
  tableName,
  recordId,
  previousData,
  newData,
  description,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});

return res.status(201).json({ success: true, log });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating audit log' });
    }
};

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'email', 'name'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json({ success: true, logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching logs' });
    }
};

exports.getUserLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const logs = await AuditLog.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        res.json({ success: true, logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching user logs' });
    }
};

exports.deleteLog = async (req, res) => {
    try {
        const { id } = req.params;
        await AuditLog.destroy({ where: { id } });
        res.json({ success: true, message: 'Log deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting log' });
    }
};