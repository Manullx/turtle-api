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

CompaniesRouter.get("/getCompanies", async (req, res) => {
    try {
        const companies = await CompaniesModel.findAll({
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

CompaniesRouter.get("/getCompanyByCnpj", async (req, res) => {
    const cnpj = req.query.cnpj;
    try {   
      const company = await CompaniesModel.findOne({
        where: {
          company_register: cnpj
        }
      });
  
      if (company) {
        res.status(200).json({ found: true, company });
      } else {
        res.status(200).json({ found: false, message: 'Cnpj não encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao buscar estabelecimento por cnpj:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

module.exports = CompaniesRouter;