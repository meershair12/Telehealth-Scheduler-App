
const { USER_ROLES } = require("../controllers/privilliges.controller");

// accessControl.js

const availablePrivileges = {
  PCC: "PCC",
  CDS: "CDS",
  PCM: "PCM",
  SUPER_ADMIN: "superadmin",
};

class AccessControl {
  static denyAccess(res, message = "Forbidden: Insufficient privileges") {
    return false
  }

  static allUsers(user, res, allowedPrivileges = []) {
    if (!user || !allowedPrivileges.includes(user.privilege)) {
      return this.denyAccess(res);
    }
    return true;
  }

  static pccOnly(user, res) {
    if (!user || ![availablePrivileges.PCC, availablePrivileges.SUPER_ADMIN, availablePrivileges.PCM].includes(user.privilege)) {
      return this.denyAccess(res);
    }
    return true;
  }

  static cdsOnly(user, res) {
    if (!user || user.privilege !== availablePrivileges.CDS) {
      return this.denyAccess(res);
    }
    return true;
  }

  static pcmOnly(user, res) {
    if (!user || ![availablePrivileges.PCM, availablePrivileges.SUPER_ADMIN].includes(user.privilege)) {
      return this.denyAccess(res);
    }
    return true;
  }

  static superAdminOnly(user, res) {
    if (!user || user.privilege !== availablePrivileges.SUPER_ADMIN) {
      return this.denyAccess(res);
    }
    return true;
  }

  static authorizeByPrivileges(allowedPrivileges = [], user) {

    if (!user || !allowedPrivileges.includes(user.privilege)) {
      return this.denyAccess();
    }
    return true
  }
}

const unAuthorizedAccessResponse = {
        status: false,
        type: "unauthorized_access",
        message: "Access denied: User is blocked",
        redirectTo: "/contact-admin" // frontend ko redirect karne ke liye
    }


module.exports = { AccessControl, availablePrivileges,unAuthorizedAccessResponse };
