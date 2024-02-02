const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const Database = require("./index.js");

const AdminsModel = Database.define("admins", {
  admin_id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  admin_name: {
    type: STRING,
    allowNull: false
  },
  admin_email: {
    type: STRING,
    allowNull: false
  },
  admin_password: {
    type: STRING,
    allowNull: false
  },

  
}, {timestamps: false})

Database.sync();

module.exports = AdminsModel;