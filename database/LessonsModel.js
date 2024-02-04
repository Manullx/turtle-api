
const { INTEGER, STRING, TEXT } = require("sequelize");
const Database = require("./index.js");

const QuestionsModel = require("./QuestionsModel.js")

const LessonsModel = Database.define("lessons", {
    lesson_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    module_id: {
        type: INTEGER,
        references: {
            model: "modules",
            key: "module_id"
        },
        allowNull: false
    },
    lesson_title: {
        type: TEXT,
        allowNull: false
    },
    lesson_richtext: {
        type: TEXT,
        allowNull: false
    },
    lesson_pdf_url: {
        type: STRING,
        allowNull: false
    },
    lesson_video_url: {
        type: STRING,
        allowNull: false
    }

}, { timestamps: false })

Database.sync();

module.exports = LessonsModel;