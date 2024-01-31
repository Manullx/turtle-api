
const { INTEGER, STRING, TEXT } = require("sequelize");
const Database = require("./index.js");

const CoursesModel = Database.define("courses", {
    course_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    course_title: {
        type: STRING,
        allowNull: false
    },
    course_description: {
        type: TEXT,
        allowNull: false
    }
}, {timestamps: false});

Database.sync();

module.exports = CoursesModel;