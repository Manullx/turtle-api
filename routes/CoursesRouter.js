
const { Router } = require("express");

const CoursesRouter = Router();



const CoursesModel = require("../database/CoursesModel.js");
const ModulesModel = require("../database/ModulesModel.js");
const LessonsModel = require("../database/LessonsModels.js");
const QuestionsModel = require("../database/QuestionsModel.js");
const QuestionsOptionsModel = require("../database/QuestionsOptionsModel.js");

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
                    const { lesson_richtext, lesson_video_url, lesson_pdf_url } = lesson;

                    LessonsModel.create({ module_id, lesson_richtext, lesson_video_url, lesson_pdf_url });
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

})

module.exports = CoursesRouter;