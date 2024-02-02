
const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const Database = require("./index.js");

const CompaniesModel = require('./CompaniesModel.js');

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
  student_password: {
    type: STRING,
    allowNull: true
  },
  first_login: {
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  student_company_id: {
    type: INTEGER,
    allowNull: true,
    references: {
      model: "companies",
      key: "company_id"  
    }
  }
}, {timestamps: false})


Database.sync();

module.exports = StudentsModel;