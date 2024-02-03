const { Router } = require("express");

const CompaniesModel = require("../database/CompaniesModel.js");

const CompaniesRouter = Router();

CompaniesRouter.post("/createCompany", (req, res) => {
    const company = req.body;

    const {
        company_name,
        company_register,
        company_email,
        company_number,
    } = company;

    CompaniesModel.create({
        company_name,
        company_register,
        company_email,
        company_number,
    }).then(() => {
        res.status(200).send("Empresa criada com sucesso")
    }).catch(err => {
        throw err;
    })
})

StudentsRouter.get("/getStudents", async (req, res) => {
    try {
        const companies = await StudentsModel.findAll({
            attributes: { exclude: ['company_id'] },
          });

  
      if (companies) {
        res.status(200).json(companies);
      } 
    } catch (error) {
      console.error('Erro ao buscar estabelecimentos', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.', details: 'Erro ao buscar estabelecimentos' });
    }
});

module.exports = CompaniesRouter;