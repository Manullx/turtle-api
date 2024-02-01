
const { INTEGER, STRING, TEXT } = require("sequelize");
const Database = require("./index.js");

const ModulesModel = require("./ModulesModel.js");
const QuestionsModel = require("./QuestionsModel.js");

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

CoursesModel.hasMany(ModulesModel, { foreignKey: "course_id", allowNull: false, as: "modules" });
CoursesModel.hasMany(QuestionsModel, { foreignKey: "course_id", allowNull: false, as: "questions" });

Database.sync();

module.exports = CoursesModel;