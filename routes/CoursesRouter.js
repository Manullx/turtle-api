
const { Router } = require("express");

const CoursesRouter = Router();
const { Op } = require("sequelize");


const CoursesModel = require("../database/CoursesModel.js");
const ModulesModel = require("../database/ModulesModel.js");
const LessonsModel = require("../database/LessonsModel.js");
const QuestionsModel = require("../database/QuestionsModel.js");
const QuestionsOptionsModel = require("../database/QuestionsOptionsModel.js");
const StudentsModel = require("../database/StudentsModel.js");

CoursesRouter.post("/createCourse", (req, res) => {

    const courseInformation = req.body;
    const { course_title, course_description } = courseInformation;

    const { modules } = courseInformation;

    const { questions } = courseInformation;

    CoursesModel.create({ course_title, course_description }).then(courseInfo => {

        const { course_id } = courseInfo.dataValues;

        modules.map(module => {
            ModulesModel.create({ course_id, module_title: module.module_title }).then(moduleInfo => {

                const { module_id } = moduleInfo.dataValues;

                module.lessons.map(lesson => {
                    const { lesson_richtext, lesson_video_url, lesson_pdf_url, lesson_title } = lesson;

                    LessonsModel.create({ module_id, lesson_richtext, lesson_video_url, lesson_pdf_url, lesson_title });
                })

            })
        });

        questions.map(question => {
            const { question_text, question_answer } = question;

            QuestionsModel.create({ course_id, question_text, question_answer }).then(questionInfo => {

                const { question_id } = questionInfo.dataValues;

                question.question_options.map(question_option => {

                    const { question_option_letter, question_option_text } = question_option;

                    QuestionsOptionsModel.create({ question_id, question_option_text, question_option_letter });

                })

            });

        });

        res.status(200).send("Curso criado com sucesso")
    }).catch(err => {
        throw err;
    })


})

CoursesRouter.get("/getCourseStudent", async (req, res) => {
    const idStudent = req.query.idStudent;

    console.log(idStudent)

    try {
        const courseStudent = await StudentsModel.findAll({
            where: {
                student_id: idStudent,  
            },
        });

        if (!courseStudent || courseStudent.length === 0) {
            return res.status(200).json({ success: true, message: 'Aluno não encontrado ou não matriculado em nenhum curso.' });
        }

        const idsCourse = courseStudent.map(curso => curso.curso_id);

        const dadosCursos = await CoursesModel.findAll({
            where: {
                course_id: {
                    [Op.in]: idsCourse,
                },
            },
            include: [
                {
                    model: ModulesModel,
                    as: "modules",
                    include: {
                        model: LessonsModel,
                        as: "lessons",
                    },
                },
                {
                    model: QuestionsModel,
                    as: "questions",
                    include: {
                        model: QuestionsOptionsModel,
                        as: "questionsOptions",
                    },
                },
            ],
        });

        res.status(200).json(dadosCursos.map(curso => curso.toJSON()));
    } catch (error) {
        console.error('Erro ao buscar cursos do aluno', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.', details: 'Erro ao buscar cursos do aluno' });
    }
});

CoursesRouter.get("/getAdminCourses", (req, res) => {

    CoursesModel.findAll(
        {
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
        }
    ).then(coursesData => {
        res.send( coursesData.map( course => course.toJSON() ) )
    }).catch(err => { 
        throw err
     });

});

CoursesRouter.delete("/deleteCourse", async (req, res) => {
    const {id} = req.headers;
  
    try {
      const course = await CoursesModel.findOne({
        where: {
          course_id: id
        }
      });
  
      if (!course) {
        return res.status(404).json({ success: false, message: 'Curso não encontrado.' });
      }
  
      await course.destroy();
  
      res.status(200).json({ success: true, message: 'Curso excluído com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir curso', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.', details: 'Erro ao excluir curso' });
    }
  });

module.exports = CoursesRouter;