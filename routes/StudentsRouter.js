const { Router } = require('express');

const StudentsRouter = Router();

const StudentsModel = require('../database/StudentsModel');

StudentsRouter.post("/createStudent", (req, res) => {
    const student = req.body;

    const {
        student_name,
        student_document,
        student_email,
        student_phone
    } = student;

    StudentsModel.create({
        student_name,
        student_document,
        student_email,
        student_phone
    }).then(() => {
        res.status(200).send("Estudante criado com sucesso")
    }).catch(err => {
        throw err;
    })
})