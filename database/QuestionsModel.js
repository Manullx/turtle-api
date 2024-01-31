
const { INTEGER, STRING } = require("sequelize");
const Database = require("./index.js");

const QuestionsModel = Database.define("questions", {
    question_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    course_id: {
        type: INTEGER,
        references: {
            model: "courses",
            key: "course_id"
        },
        allowNull: false
    },
    question_text: {
        type: STRING,
        allowNull: false
    },
    question_answer: {
        type: STRING(1),
        allowNull: false
    }
}, {timestamps: false})

Database.sync();

module.exports = QuestionsModel;