const { Router } = require('express');


const RegistersRouter = Router();

const RegistersModel = require('../database/RegistersModel');
const StudentsModel = require('../database/StudentsModel');
const CoursesModel = require('../database/CoursesModel');

RegistersRouter.get('/getRegistersByStudent', async (req, res) => {
  const document = req.query.document;

  try {
    const student = await StudentsModel.findOne({
      where: {
        student_document: document
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Estudante não encontrado.' });
    }

    const registers = await RegistersModel.findAll({
      where: {
        student_id: student.student_id
      },
      include: [
        {
          model: CoursesModel,
          attributes: ['course_title'], 
          as: 'course',// Especifique os atributos que deseja incluir
          required: false // Isso tornará a junção LEFT JOIN
        }
      ]
    });

    // const courses = await CoursesModel.findOne({
    //   where: {
    //     student_id: student.student_id
    //   }
    // });

    if (!registers) {
      return res.status(404).json({ success: false, message: 'Matriculas não encontrado.' });
    }

    console.log(registers)

    const responseData = {
      registers,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erro ao buscar matriculas', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.', details: 'Erro ao buscar matriculas' });
  }

})

module.exports = RegistersRouter