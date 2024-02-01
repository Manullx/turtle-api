const { Router } = require("express");

const CompaniesModel = require("../models/CompaniesModel.js");
const CompaniesAddressModel = require("../models/CompaniesAddressModel.js");

const CompaniesRouter = Router();

CompaniesRouter.post("/createCompany", (req, res) => {
    let {

        company_name,
        company_contact_email,
        company_cnpj,
        company_contact_telephone,
        company_cep,
        company_street,
        company_address_number,
        company_district,
        company_city,
        company_state

    } = req.body;

    let companyInfoVerification = fieldsVerification("POST", req.body, CompaniesModel.getAttributes());
    let companyAddressVerification = fieldsVerification("POST", req.body, CompaniesAddressModel.getAttributes());

    if (companyInfoVerification.error) {
        res.status(500).json(companyInfoVerification);
    } else if (companyAddressVerification.error) {
        res.status(500).json(companyAddressVerification)
    } else {
        CompaniesModel.findOrCreate({ where: { company_cnpj }, defaults: { company_name, company_contact_email, company_cnpj, company_contact_telephone } })
            .then(companyData => {
                let [companyInfo, created] = companyData;

                if (created) {
                    //TODO Melhoria na Tratativa de erros cadastro endereço
                    CompaniesAddressModel.create({
                        company_id: companyInfo.getDataValue("company_id"),
                        company_cep,
                        company_street,
                        company_address_number,
                        company_district,
                        company_city,
                        company_state
                    })

                }

                res.status(201).json({ created });
            })
            .catch(err => {
                res.status(500).send(err)
            })
    }

})

CompaniesRouter.get("/getCompanies", (req, res) => {
    CompaniesModel.findAll().then(companies => {
        res.status(200).json(companies)
    })
})

CompaniesRouter.put("/editCompany", (req, res) => {
    let { company_id } = req.body;
    let companyInfo = req.body;

    if (company_id) {
        delete companyInfo.company_id;

        let verification = fieldsVerification("PUT", companyInfo, CompaniesModel.getAttributes());

        if (verification.error) {
            res.status(400).json(verification);
        } else {
            CompaniesModel.update(companyInfo, { where: { company_id } })
                .then(_ => {
                    res.status(200).json({ "done": true });
                })
                .catch(err => {
                    res.status(500).json({ "done": false, err });
                })

        }
    } else {
        res.status(400).json({ "error": "company_id required" })
    }
})

CompaniesRouter.delete("/deleteCompany", (req, res) => {
    let { company_id } = req.body;

    if (company_id) {
        CompaniesModel.destroy({ where: { company_id } }).then(wasDeleted => {
            res.status(200).json({ "wasDeleted": !!wasDeleted })
        })
    } else {
        res.status(400).json({ "error": "company_id required" });
    }
})

module.exports = CompaniesRouter;