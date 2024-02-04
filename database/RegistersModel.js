
const { INTEGER, BOOLEAN, DATE } = require("sequelize");
const Database = require("./index.js");

const StudentsModel = require("./StudentsModel.js");
const CoursesModel = require("./CoursesModel.js");

const RegistersModel = Database.define("registers", {

    register_id: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    student_id: {
        type: INTEGER,
        allowNull: false,
        references: {
            model: StudentsModel,
            key: "student_id"
        },
        onDelete: 'CASCADE'
    },
    course_id: {
        type: INTEGER,
        allowNull: false,
        references: {
            model: CoursesModel,
            key: "course_id"
        }
    },
    is_done: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    conclusion_date: {
        type: DATE,
        allowNull: true
    }

}, { timestamps: false });

RegistersModel.belongsTo(CoursesModel, { foreignKey: 'course_id', as: 'course' });

Database.sync();

module.exports = RegistersModel;
