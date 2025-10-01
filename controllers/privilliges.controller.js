


const USER_ROLES = ['CDS', 'PCC', "DSS", "PCM", 'superadmin']
const USER_ROLE = {
    CDS: 'CDS', PCC: 'PCC', DSS: "DSS", PCM: "PCM", SUPER_ADMIN: 'superadmin'
}

const privilliges = async (req, res) => {

    try {

        res.status(200).json(USER_ROLES);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}



const medicalFullForms = {
  CDS: "Clinical Documentation Specialist ",
  PCC: "Patient Care Coordination",
  DSS: "Data Support Specialist",
  PCM: "Patient Care Manager",
  superadmin: "Super Administrator"
};

const  getFullForm =abbreviation=> {
  return medicalFullForms[abbreviation] || "Full form not found";
}
module.exports = {getFullForm, privilliges, USER_ROLES,USER_ROLE }