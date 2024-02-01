const { Router } = require("express");

const StudentsModel = require("../models/StudentsModel.js");

const StudentsRouter = Router();

StudentsRouter.post("/createStudent", (req, res) => {
    let { student_cpf } = req.body;

    let verification = fieldsVerification("POST", req.body, StudentsModel.getAttributes());

    if (verification.error) {
        res.status(500).json(verification);
    } else {
        StudentsModel.findOrCreate({ where: { student_cpf }, defaults: req.body })
            .then(studentData => {
                let [studentInformation, created] = studentData;
                res.status(201).json({ studentInformation, created });
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

});

StudentsRouter.get("/getStudents", (req, res) => {
    StudentsModel.findAll()
        .then(studentsData => {
            if (studentsData.length >= 1) {
                res.status(200).json(studentsData);
            } else {
                res.status(204).json(studentsData);
            }
        })
});

StudentsRouter.put("/editStudent", (req, res) => {

    let { student_id } = req.body;
    let infoToEdit = req.body;

    if (student_id) {
        delete infoToEdit.student_id;

        let verification = fieldsVerification("PUT", infoToEdit, StudentsModel.getAttributes());
        if (verification.error) {
            res.status(500).json(verification)
        } else {
            StudentsModel.update(infoToEdit, { where: { student_id } }).then(_ => {
                res.status(200).json({ "done": true });
            }).catch(err => {
                res.status(500).json({ "done": false, err })
            });
        }

    } else {
        res.status(400).json({ "error": "student_id required" })
    }

})

StudentsRouter.delete("/deleteStudent", (req, res) => {
    let { student_id } = req.body;

    if (student_id) {
        StudentsModel.destroy({ where: { student_id } }).then(wasDeleted => {
            res.status(200).json({ wasDeleted: !!wasDeleted });
        })
    } else {
        res.status(400).json({ "error": "student_id required" });
    }
});

module.exports = StudentsRouter;