
const { INTEGER, STRING } = require("sequelize");
const Database = require("./index.js");

const QuestionsOptionsModel = Database.define("questions_options", {
    question_option_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    question_id: {
        type: INTEGER,
        references: {
            model: "questions",
            key: "question_id"
        },
        allowNull: false
    },
    question_option_text: {
        type: STRING,
        allowNull: false
    },
    question_option_letter: {
        type: STRING(1),
        allowNull: false
    }

}, { timestamps: false })

Database.sync();

module.exports = QuestionsOptionsModel;    