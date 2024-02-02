const { Router } = require('express');

const StudentsRouter = Router();

const StudentsModel = require('../database/StudentsModel');
const RegistersModel = require('../database/RegistersModel');

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
 
        courses_id.map((course_id) => {
            RegistersModel.create({
                course_id,
                student_id
            })
        })
        res.status(200).send("Estudante criado com sucesso")
    }).catch(err => {
        throw err;
    })
})

StudentsRouter.get("/studentDocument/:document", async (req, res) => {
    const documentNumber = req.params.document;
  
    try {
      const student = await StudentsModel.findOne({
        where: {
          student_document: documentNumber
        }
      });
  
      if (student) {
        res.status(200).json({ found: true, student });
      } else {
        res.status(200).json({ found: false, message: 'Documento não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao buscar estudante por documento:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

StudentsRouter.get("/studentEmail", async (req, res) => {
    const { email } = req.headers;
  
    try {
      const emailAlreadyExists = await StudentsModel.findOne({
        where: {
          student_email: email
        }
      });
  
      if (emailAlreadyExists) {
        res.status(200).json({ found: true, emailAlreadyExists });
      } else {
        res.status(200).json({ found: false, message: 'E-mail não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao buscar estudante por email:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});


StudentsRouter.get("/getStudents", async (req, res) => {


    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize);
    const offset = (page - 1) * pageSize;
    const totalCount = await StudentsModel.count();

    try {
        const students = await StudentsModel.findAll({
            attributes: { exclude: ['student_id'] },
            limit: pageSize,
            offset: offset
          });


        const totalPages = Math.ceil(totalCount / pageSize);
  
      if (students) {
        res.status(200).json({students, totalPages});
      } 
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.', details: 'Erro ao buscar usuários' });
    }
});


module.exports = StudentsRouter