const { Router } = require("express");

const RegistersRouter = Router();

const RegistersModel = require("../database/RegistersModel");
const StudentsModel = require("../database/StudentsModel");
const CoursesModel = require("../database/CoursesModel");
const ModulesModel = require("../database/ModulesModel.js");
const LessonsModel = require("../database/LessonsModel.js");
const QuestionsModel = require("../database/QuestionsModel.js");
const QuestionsOptionsModel = require("../database/QuestionsOptionsModel.js");

RegistersRouter.get("/getRegistersByStudent", async (req, res) => {
  const document = req.query.document;

  try {
    const student = await StudentsModel.findOne({
      where: {
        student_document: document,
      },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Estudante não encontrado." });
    }

    const registers = await RegistersModel.findAll({
      where: {
        student_id: student.student_id,
      },
      include: [
        {
          model: CoursesModel,
          attributes: ["course_title"],
          as: "course", // Especifique os atributos que deseja incluir
          required: false, // Isso tornará a junção LEFT JOIN
        },
      ],
    });

    // const courses = await CoursesModel.findOne({
    //   where: {
    //     student_id: student.student_id
    //   }
    // });

    if (!registers) {
      return res
        .status(404)
        .json({ success: false, message: "Matriculas não encontrado." });
    }

    console.log(registers);

    const responseData = {
      registers,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Erro ao buscar matriculas", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor.",
        details: "Erro ao buscar matriculas",
      });
  }
});

RegistersRouter.get("/getRegistersByEmail", async (req, res) => {
  const {email} = req.headers;

  try {
    const student = await StudentsModel.findOne({
      where: {
        student_email: email,
      },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Estudante não encontrado." });
    }

    const registers = await RegistersModel.findAll({
      where: {
        student_id: student.student_id,
      },
      include: [
        {
          model: CoursesModel,
          as: "course", // Especifique os atributos que deseja incluir
          required: false, 
          include: [
            {
                model: ModulesModel,
                as: "modules",
                include: {
                    model: LessonsModel,
                    as: "lessons"
                }
            },
            {
                model: QuestionsModel,
                as: "questions",
                include: {
                    model: QuestionsOptionsModel,
                    as: "questionsOptions"
                }
            }
        ]
        },
      ],
    });

    // const courses = await CoursesModel.findOne({
    //   where: {
    //     student_id: student.student_id
    //   }
    // });

    if (!registers) {
      return res
        .status(404)
        .json({ success: false, message: "Matriculas não encontrado." });
    }

    registers.forEach((register) => {
      if (register.course && register.course.modules) {
        register.course.modules.sort((a, b) => a.module_id - b.module_id);
      }
    });

    const responseData = {
      registers,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Erro ao buscar matriculas", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor.",
        details: "Erro ao buscar matriculas",
      });
  }
});

RegistersRouter.delete("/deleteRegister", async (req, res) => {
  const id = req.query.id;

  try {
    const register = await RegistersModel.findOne({
      where: {
        register_id: id,
      },
    });

    if (!register) {
      return res
        .status(404)
        .json({ success: false, message: "Matricula não encontrado." });
    }

    await register.destroy();

    res
      .status(200)
      .json({ success: true, message: "Matricula excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir estudante", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor.",
        details: "Erro ao excluir matricula",
      });
  }
});

RegistersRouter.post("/createRegister", async (req, res) => {
  const { courses_id, student_document } = req.body;

  try {
    // Encontrar o estudante pelo documento
    const student = await StudentsModel.findOne({
      where: {
        student_document: student_document,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Estudante não encontrado.",
      });
    }

    const { student_id } = student;

    const createPromises = courses_id.map(async (course_id) => {
      await RegistersModel.findOrCreate({
        where: {
          course_id,
          student_id,
        }
      });
    });

    await Promise.all(createPromises);

    res.status(200).send("Matrícula criada com sucesso");
  } catch (error) {
    console.error("Erro ao realizar matrícula", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      details: "Erro ao realizar matrícula",
    });
  }
});


module.exports = RegistersRouter;
