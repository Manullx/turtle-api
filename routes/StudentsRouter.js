const { Router } = require('express');

const StudentsRouter = Router();

const StudentsModel = require('../database/StudentsModel');
const RegistersModel = require('../database/RegistersModel');
const CompaniesModel = require('../database/CompaniesModel');

StudentsRouter.post("/createStudent", (req, res) => {
    const student = req.body;

    const {
        student_name,
        student_document,
        student_email,
        student_phone,
        student_password,
        courses_id,
        student_company_id
    } = student;

    StudentsModel.create({
        student_name,
        student_document,
        student_email,
        student_phone,
        student_password,
        student_company_id
    }).then((studentInfo) => {

        const { student_id } = studentInfo.dataValues;

        courses_id.map((course) => {
            RegistersModel.create({
                course,
                student_id
            })
        })
        res.status(200).send("Estudante criado com sucesso")
    }).catch(err => {
        throw err;
    })
})