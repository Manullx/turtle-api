
const { Router } = requrie("express");

const AdminsRouter = Router();

const AdminsModel = require("../database/AdminsModel.js");

AdminsRouter.post("/createAdmin", (req, res) => {

    const {
        admin_name,
        admin_email,
        admin_password
    } = req.body;

    AdminsModel.findOrCreate({ where: { admin_email }, defaults: { admin_name, admin_email, admin_password } }).then(_ => {
        res.status(200).send({ created: true })
    });

});

AdminsRouter.post("/authAdmin", (req, res) => {
    const { admin_email, admin_password } = req.body;

    AdminsModel.findOne({ where: { admin_email } }).then( adminInfo => {
        if ( adminInfo.getDataValue("admin_password") == admin_password ) {
            let adminInfoJSON = adminInfo.toJSON()
            delete adminInfoJSON.admin_password;
            res.status(200).send({ auth: true, adminInfoJSON })
        } else if ( adminInfo.getDataValue("admin_password") != admin_password ) {
            res.status(200).send({ auth: false })
        }
    });
});
