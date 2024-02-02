
const { INTEGER, STRING } = require("sequelize");
const Database = require("./index.js");

const LessonsModel = require("./LessonsModel.js");

const ModulesModel = Database.define("modules", {
    module_id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: INTEGER,
        references: {
            model: "courses",
            key: "course_id"
        }
    },
    module_title: {
        type: STRING,
        allowNull: false
    }
}, {timestamps: false})

ModulesModel.hasMany(LessonsModel, { foreignKey: "module_id", allowNull: false, as: "lessons" });

Database.sync();

module.exports = ModulesModel;