
const { INTEGER, STRING, TEXT } = require("sequelize");
const Database = require("./index.js");

const CompaniesModel = Database.define("companies", {
    company_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    company_name: {
        type: STRING(30),
        allowNull: false
    },
    company_register: {
        type: STRING(14),
        allowNull: false
    },
    company_number: {
        type: STRING,
        allowNull: false
    },
    company_email: {
        type: STRING,
        allowNull: false
    }
    
}, { timestamps: false });

Database.sync()

module.exports = CompaniesModel;
