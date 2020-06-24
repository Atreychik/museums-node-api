const bcrypt = require("bcrypt");

const { ADMIN, GUIDE, VISITOR } = require("../constant/roles");
const Role = require("../models/data/role");
const User = require("../models/data/user");

exports.initDbData = async () => {
  await Role.find({}, (err, roles) => {
    if (roles.length) return;

    Role.create([{ role: ADMIN }, { role: GUIDE }, { role: VISITOR }]);
  });

  User.find({}, async (err, users) => {
    if (users.length) return;

    const { _id: role } = await Role.findOne({ role: ADMIN });
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    User.create({
      username: "ADMIN",
      password: hashedPassword,
      email: "admin@admin.com",
      name: "Andrey Yatsenko",
      age: 27,
      role: role,
      isAproved: true,
    });
  });
};
