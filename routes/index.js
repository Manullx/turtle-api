
const { Router } = require("express");

const IndexRouter = Router();

IndexRouter.use(require("./CoursesRouter"));
IndexRouter.use(require("./StudentsRouter"));
IndexRouter.use(require("./CompaniesRouter.js"));
IndexRouter.use(require("./RegistersRouter.js"));
IndexRouter.use(require("./CertificateRouter.js"));
IndexRouter.use(require("./AdminRouter.js"));

const AdminsModel = require("../database/AdminsModel.js");
const StudentsModel = require("../database/StudentsModel.js");

IndexRouter.post("/emailUser", (req, res) => {

    const { email } = req.body;

    AdminsModel.findOne({ where: { admin_email: email } }).then( adminInfo => {
        if (!!adminInfo) {
            res.status(200).send({ found: true, type: "admin" })
        } else {
            StudentsModel.findOne({ where: { student_email: email } }).then( studentEmail => {
                if (!!studentEmail) {
                    res.status(200).send( { found: true, type: "student", first_login: studentEmail.getDataValue("first_login") } );
                } else {
                    res.status(200).send( { found: false } );
                }
            });    
        }
    });

});

module.exports = IndexRouter;
