const User = require("../models/user.model");



// 🟢 Create (POST /scim/v2/Users)
exports.createUser = async (req, res) => {
  try {
    const data = req.body;

    // Azure SCIM payload example:
    // {
    //   userName: "jane.doe@company.com",
    //   name: { givenName: "Jane", familyName: "Doe" },
    //   active: true,
    //   emails: [{ value: "jane.doe@company.com", primary: true }]
    // }

    const newUser = await User.create({
      firstName: data?.name?.givenName || "Unknown",
      lastName: data?.name?.familyName || "",
      username: data.userName,
      email: data?.emails?.[0]?.value || data.userName,
      password: "Temp@12345", // temporary password
      privilege: "PCC", // default role if not sent
      status: data.active ? "active" : "inactive",
      isActionRequired: true,
    });

    // Response as per SCIM schema
    res.status(201).json({
      schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
      id: newUser.id,
      userName: newUser.username,
      name: {
        givenName: newUser.firstName,
        familyName: newUser.lastName,
      },
      active: newUser.status === "active",
      emails: [{ value: newUser.email, primary: true }],
    });
  } catch (err) {
    console.error("SCIM Create Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update (PATCH /scim/v2/Users/:id)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Operations } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Loop through SCIM operations
    for (const op of Operations) {
      if (op.op === "replace") {
        switch (op.path) {
          case "active":
            user.status = op.value ? "active" : "inactive";
            break;
          case "name.givenName":
            user.firstName = op.value;
            break;
          case "name.familyName":
            user.lastName = op.value;
            break;
          case "emails":
            user.email = op.value?.[0]?.value || user.email;
            break;
          default:
            console.log("Unhandled SCIM patch path:", op.path);
        }
      }
    }

    await user.save();

    res.status(200).json({
      schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
      id: user.id,
      userName: user.username,
      name: {
        givenName: user.firstName,
        familyName: user.lastName,
      },
      active: user.status === "active",
      emails: [{ value: user.email, primary: true }],
    });
  } catch (err) {
    console.error("SCIM Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete (DELETE /scim/v2/Users/:id)

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🧩 Soft delete: mark inactive + set deletedAt timestamp
    user.status = "inactive";
    user.deletedAt = new Date();

    await user.save();

    res.status(204).send(); // No content
  } catch (err) {
    console.error("SCIM Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
};


