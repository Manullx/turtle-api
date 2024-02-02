let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require("cors")

require("dotenv").config();

const Database = require("./database/index.js");
const AdminModel = require("./database/AdminsModel.js");
const StudentsModel = require("./database/StudentsModel.js");
const CompaniesModel = require("./database/CompaniesModel.js");
const CoursesModel = require("./database/CoursesModel.js");
const RegistersModel = require("./database/RegistersModel.js");
const ModulesModel = require("./database/ModulesModel.js");
const LessonsModel = require("./database/LessonsModel.js");
const QuestionsModel = require("./database/QuestionsModel.js");
const QuestionsOptionsModel = require("./database/QuestionsOptionsModel.js");




const indexRouter = require('./routes/index');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use(indexRouter);

module.exports = app;
