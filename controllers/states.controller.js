const State = require("../models/states.model");
const { unAuthorizedAccessResponse } = require("../Utils/services");
const { USER_ROLE, USER_ROLES } = require("./privilliges.controller");

// ✅ Add new State
const addState = async (req, res) => {
  try {
    const data = req.body;
    
    
    const { privilege: u_role } = req.user
    //  All user can edit the state information
    if (USER_ROLES.includes(u_role)) {

      // Agar array hai
      if (Array.isArray(data)) {
        const insertedStates = await State.bulkCreate(data, { validate: true });
        return res.status(201).json({ message: "States created successfully", states: insertedStates });
      }

      // Agar single object hai
      const { stateName, stateCode, details, timezone } = data;
      const state = await State.create({ stateName, stateCode, details, timezone });
      res.status(201).json({ message: "State created successfully", state });
    }
    res.status(401).json(unAuthorizedAccessResponse)
  } catch (error) {
    console.log(error )
    res.status(400).json({ error: error.errors[0].message });
  }
};

// ✅ Fetch all States
const getAllStates = async (req, res) => {
  try {
    const states = await State.findAll();
    res.json({ status: "success", states: states });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Fetch single State by ID
const getStateByCode = async (req, res) => {
  try {
    const { stateCode } = req.params;

    // find by stateCode
    const state = await State.findOne({ where: { stateCode } });

    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }

    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update State
const updateState = async (req, res) => {
  try {

    const { privilege: u_role } = req.user
    //  All user can edit the state information
    if (USER_ROLES.includes(u_role)) {

      const { stateName, stateCode, details,timezone } = req.body;
      const state = await State.findByPk(req.params.id);

      if (!state) {
        return res.status(404).json({ error: "State not found" });
      }

      state.stateName = stateName || state.stateName;
      state.stateCode = stateCode || state.stateCode;
      state.timezone = timezone || state.timezone;
      state.details = details || state.details;

      await state.save();
      res.json({ message: "State updated successfully", state });
    }

    res.status(401).json(unAuthorizedAccessResponse)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete State
const deleteState = async (req, res) => {
  try {
    // Only Super Admin Can Delete
    if ([USER_ROLE.SUPER_ADMIN]) {
      const state = await State.findByPk(req.params.id);
      if (!state) {
        return res.status(404).json({ error: "State not found" });
      }

      await state.destroy();
      res.json({ message: "State deleted successfully" });
    }
    res.status(401).json(unAuthorizedAccessResponse)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addState,
  getAllStates,
  getStateByCode,
  updateState,
  deleteState
};