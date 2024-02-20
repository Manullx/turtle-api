const { Router } = require("express");
const { mkdir, access } = require("node:fs");

const StudentsRouter = Router();

const StudentsModel = require("../database/StudentsModel");
const RegistersModel = require("../database/RegistersModel");
const CompaniesModel = require("../database/CompaniesModel");

const certificatesPath = __dirname + "/../certificates";

StudentsRouter.post("/createStudent", async (req, res) => {
  const student = req.body;
  
  const {
    student_name,
    student_document,
    student_email,
    student_phone,
    student_password,
    courses_id,
    student_company_id,
  } = student;

  let company_info;
  if (student_company_id !== null) {
    company_info = await CompaniesModel.findOne({
      where: {
        company_register: student_company_id,
      },
    });
  }

  console.log(company_info.company_id)

  const directoryPath = certificatesPath + "/" + student_document; // Caminho completo do diretório

  // Verificando se o diretório já existe
  access(directoryPath, (err) => {
    if (err) {
      // Se o diretório não existe, tenta criar
      mkdir(directoryPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Erro ao criar o diretório:', err);
          res.status(500).send({ error: 'Erro ao criar o diretório' });
          return;
        }
      });
    }
  });

  StudentsModel.create({
    student_name,
    student_document,
    student_email,
    student_phone,
    student_password,
    company_id: company_info.company_id
  })
  .then((studentInfo) => {
    console.log(studentInfo);
    const { student_id } = studentInfo.dataValues;
          
    courses_id.map((course_id) => {
      RegistersModel.create({
        course_id,
        student_id,
      });
    });
    res.status(200).send({ created: true });
  })
  .catch((err) => {
    console.log(err)
    res.status(400).send(err);
  });
});

StudentsRouter.get("/studentDocument/:document", async (req, res) => {
  const documentNumber = req.params.document;

  try {
    const student = await StudentsModel.findOne({
      where: {
        student_document: documentNumber,
      },
    });

    if (student) {
      res.status(200).json({ found: true, student });
    } else {
      res
        .status(200)
        .json({ found: false, message: "Documento não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar estudante por documento:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
});

StudentsRouter.get("/studentEmail", async (req, res) => {
  const { email } = req.headers;

  try {
    const emailAlreadyExists = await StudentsModel.findOne({
      where: {
        student_email: email,
      },
    });

    if (emailAlreadyExists) {
      res.status(200).json({ found: true, emailAlreadyExists });
    } else {
      res.status(200).json({ found: false, message: "E-mail não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar estudante por email:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
});

StudentsRouter.get("/getStudents", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize);
  const offset = (page - 1) * pageSize;
  const totalCount = await StudentsModel.count();

  try {
    const students = await StudentsModel.findAll({
      attributes: { exclude: ["student_id"] },
      limit: pageSize,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    if (students) {
      res.status(200).json({ students, totalPages });
    }
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor.",
        details: "Erro ao buscar usuários",
      });
  }
});

StudentsRouter.get("/getStudentByDocument", async (req, res) => {
  const document = req.query.document;

  try {
    const student = await StudentsModel.findOne({
      attributes: { exclude: ["student_id"] },
      where: {
        student_document: document,
      },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Estudante não encontrado." });
    }

    console.log(student);

    const company = await CompaniesModel.findOne({
      where: {
        company_id: student.company_id,
      },
    });

    if (!company) {
      console.warn(
        "Empresa não encontrada para o estudante com ID de empresa:",
        student.company_id
      );
    }

    const responseData = {
      student,
      company: company || null,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Erro ao buscar estudante", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor.",
        details: "Erro ao buscar estudante",
      });
  }
});

StudentsRouter.delete("/deleteStudent", async (req, res) => {
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

    await student.destroy();

    res
      .status(200)
      .json({ success: true, message: "Estudante excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir estudante", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor.",
        details: "Erro ao excluir estudante",
      });
  }
});

// StudentsRouter.post("/createPassStudent", (req, res) => {
//     const { student_email, student_password } = req.body;

//     StudentsModel.update({ where: { student_email: student_email } }, { student_password }).then( userInfo => {
//         userInfo = userInfo.toJSON();
//         delete userInfo.student_password, userInfo.student_id;
//         res.status(200).send( userInfo );

//     });

// });

StudentsRouter.post("/createPassStudent", (req, res) => {
  const { student_email, student_password } = req.body;

  StudentsModel.findOne({
    where: { student_email },
    attributes: ["student_id"],
  })
    .then((student) => {
      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Estudante não encontrado." });
      }

      const studentId = student.student_id;

      StudentsModel.update(
        { student_password, first_login: false },
        {
          where: { student_email },
        }
      )
        .then(() => {
          StudentsModel.findByPk(studentId, {
            attributes: { exclude: ["student_password"] },
          })
            .then((updatedStudent) => {
              if (updatedStudent) {
                res.status(200).json({
                  success: true,
                  message: "Senha atualizada com sucesso.",
                  user: updatedStudent.toJSON(),
                });
              } else {
                res
                  .status(404)
                  .json({
                    success: false,
                    message: "Estudante não encontrado após a atualização.",
                  });
              }
            })
            .catch((error) => {
              console.error(
                "Erro ao buscar informações do estudante após a atualização",
                error
              );
              res
                .status(500)
                .json({
                  success: false,
                  message: "Erro interno do servidor.",
                  details:
                    "Erro ao buscar informações do estudante após a atualização",
                });
            });
        })
        .catch((error) => {
          console.error("Erro ao atualizar senha do estudante", error);
          res
            .status(500)
            .json({
              success: false,
              message: "Erro interno do servidor.",
              details: "Erro ao atualizar senha do estudante",
            });
        });
    })
    .catch((error) => {
      console.error("Erro ao buscar estudante antes da atualização", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Erro interno do servidor.",
          details: "Erro ao buscar estudante antes da atualização",
        });
    });
});

StudentsRouter.post("/authStudent", (req, res) => {
  const { student_email, student_password } = req.body;

  StudentsModel.findOne({
    where: { student_email },
    attributes: { exclude: ["company_id"] },
  }).then((studentInfo) => {
    if (studentInfo) {
      if (studentInfo.getDataValue("student_password") == student_password) {
        let studentInfoJson = studentInfo.toJSON();
        delete studentInfoJson.student_password;
        res.status(200).send({ auth: true, studentInfoJson });
      } else if (
        studentInfo.getDataValue("student_password") != student_password
      ) {
        res.status(200).send({ auth: false });
      }
    } else {
      res.status(500).send({ auth: false });
    }
  });
});

StudentsRouter.put("/updateStudent", async (req, res) => {
  const document = req.query.document;
  const updatedData = req.body;

  const {
    student_name,
    student_document,
    student_email,
    student_phone,
    student_password,
  } = updatedData.student;

  const { company_register } = updatedData.workplace;

  const company = await CompaniesModel.findOne({
    where: {
      company_register: company_register
    }
  })

  const { company_id } = company;

  const data = {
    student_name,
    student_document,
    student_email,
    student_phone,
    student_password,
    company_id,
  };

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

    await student.update(data);

    res
      .status(200)
      .json({ success: true, message: "Estudante atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar estudante", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erro interno do servidor.",
        details: "Erro ao atualizar estudante",
      });
  }
});

module.exports = StudentsRouter;
