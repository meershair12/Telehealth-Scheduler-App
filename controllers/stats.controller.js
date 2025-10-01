


// controllers/stats.controller.js
const { Op } = require('sequelize');
const User = require('../models/user.model');
const TelehealthProvider = require('../models/provider.model');
const State = require('../models/states.model');
const Availability = require('../models/scheduler.model');
const Reservation = require('../models/reservation.model');

const getDashboardStats = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 1. Total Users and Active Users
    const totalUsers = await User.count();
    const activeUsers = await User.count({
      where: { status: 'active' }
    });

    // 2. Total Telehealth Providers and Active Providers
    const totalProviders = await TelehealthProvider.count();
    const activeProviders = await TelehealthProvider.count({
      where: { status: 'Active' }
    });

    // 3. Total States and Active States (assuming states with providers are active)
    const totalStates = await State.count();
    const activeStates = await State.count({
      include: [{
        model: Availability,
        required: true,
        where: {
          status: {
            [Op.in]: ['Available', 'Reserved', 'Confirmed']
          }
        }
      }],
      distinct: true
    });

    // 4. Total Available Telehealth Providers and Today's Available
    const totalAvailableProviders = await Availability.count({
      where: {
        status: 'Available',
        startTime: {
          [Op.gte]: new Date()
        }
      },
      distinct: ['providerId']
    });

    const todayAvailableProviders = await Availability.count({
      where: {
        status: 'Available',
        startTime: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      distinct: ['providerId']
    });

    // 5. Total Reservations and Today's Reservations
    const totalReservations = await Reservation.count();
    const todayReservations = await Reservation.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        },
        status: 'reserved'
      }
    });

    // Alternative way to get reservations from Availability table
    const totalReservedFromAvailability = await Availability.count({
      where: { status: 'reserved' }
    });

    const todayReservedFromAvailability = await Availability.count({
      where: {
        status: 'reserved',
        startTime: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    // 6. Total Confirmations and Today's Confirmations
    const totalConfirmations = await Reservation.count({
      where: { status: 'confirmed' }
    });

    const todayConfirmations = await Reservation.count({
      where: {
        status: 'confirmed',
        updatedAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    // Alternative from Availability table
    const totalConfirmedFromAvailability = await Availability.count({
      where: { status: 'confirmed' }
    });

    const todayConfirmedFromAvailability = await Availability.count({
      where: {
        status: 'confirmed',
        startTime: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    // 7. Total Cancellations and Today's Cancellations
    const totalCancellations = await Reservation.count({
      where: { status: 'cancelled' }
    });

    const todayCancellations = await Reservation.count({
      where: {
        status: 'cancelled',
        updatedAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

     // 7. Total Cancellations and Today's Cancellations
    const totalMisseds = await Reservation.count({
      where: { status: 'cancelled' }
    });
    const todayMisseds = await Reservation.count({
      where: {
        status: 'missed',
        updatedAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    // Response object matching your frontend structure
    const stats = {
      totalUsers,
      activeUsers,
      totalProviders,
      activeProviders,
      totalStates,
      activeStates,
      totalAvailableProviders,
      todayAvailableProviders,
      totalReservations: totalReservations || totalReservedFromAvailability,
      todayReservations: todayReservations || todayReservedFromAvailability,
      totalConfirmations: totalConfirmations || totalConfirmedFromAvailability,
      todayConfirmations: todayConfirmations || todayConfirmedFromAvailability,
      todayMisseds,
      totalMisseds,
      totalCancellations,
      todayCancellations
    };

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get detailed stats with breakdown
const getDetailedStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Weekly stats
    const weeklyReservations = await Reservation.count({
      where: {
        createdAt: {
          [Op.gte]: startOfWeek
        }
      }
    });

    // Monthly stats
    const monthlyReservations = await Reservation.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });

    // Provider stats by specialty
    const providersBySpecialty = await TelehealthProvider.findAll({
      attributes: [
        'specialty',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['specialty'],
      where: { status: 'Active' }
    });

    // State-wise availability
    const stateWiseAvailability = await Availability.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('Availability.id')), 'availabilityCount']
      ],
      include: [{
        model: State,
        attributes: ['stateName', 'stateCode']
      }],
      where: {
        status: 'Available',
        startTime: {
          [Op.gte]: new Date()
        }
      },
      group: ['State.id', 'State.stateName', 'State.stateCode']
    });

    res.status(200).json({
      success: true,
      data: {
        weeklyReservations,
        monthlyReservations,
        providersBySpecialty,
        stateWiseAvailability
      },
      message: 'Detailed statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching detailed stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch detailed statistics',
      error: error.message
    });
  }
};

// Get real-time stats (for live updates)
const getRealTimeStats = async (req, res) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));

    // Recent activities in last hour
    const recentReservations = await Reservation.count({
      where: {
        status:"reserved",
        createdAt: {
          [Op.gte]: oneHourAgo
        }
      }
    });

    const recentConfirmations = await Reservation.count({
      where: {
        status: 'confirmed',
        updatedAt: {
          [Op.gte]: oneHourAgo
        }
      }
    });

    const recentCancellations = await Reservation.count({
      where: {
        status: 'cancelled',
        updatedAt: {
          [Op.gte]: oneHourAgo
        }
      }
    });

    // Currently available slots
    const currentAvailableSlots = await Availability.count({
      where: {
        status: 'Available',
        startTime: {
          [Op.gte]: now
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        recentReservations,
        recentConfirmations,
        recentCancellations,
        currentAvailableSlots,
        lastUpdated: new Date()
      },
      message: 'Real-time statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching real-time stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getDetailedStats,
  getRealTimeStats
};