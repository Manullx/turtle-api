const { INTEGER, STRING } = require("sequelize");
const Database = require("./index.js");

const StudentsModel = Database.define("students", {
  student_id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  student_name: {
    type: STRING,
    allowNull: false
  },
  student_document: {
    type: INTEGER,
    allowNull: false
  },
  student_email: {
    type: STRING,
    allowNull: false
  },
  student_phone: {
    type: STRING,
    allowNull: true
  },

}, {timestamps: false})

Database.sync();

module.exports = StudentsModel;