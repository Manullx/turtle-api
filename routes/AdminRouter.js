
const { Router } = require("express");

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

AdminsRouter.post('/createAdmin', (req, res) => {
    const { admin_email, admin_name, admin_password } = req.body;

    AdminsModel.create({
        admin_email,
        admin_name,
        admin_password
    }).then(() => {
        res.status(200).send({ success: true})
    }).catch(() => {
        res.status(500).send({ success: false})
    })
})

AdminsRouter.get('/getAdmins', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize);
    const offset = (page - 1) * pageSize;
    const totalCount = await AdminsModel.count();

    try {
        const admins = await AdminsModel.findAll({
          attributes: { exclude: ["admin_id"] },
          limit: pageSize,
          offset: offset,
        });
    
        const totalPages = Math.ceil(totalCount / pageSize);
    
        if (admins) {
          res.status(200).json({ admins, totalPages });
        }
    } catch (error) {
        res
        .status(500)
        .json({
          success: false,
          message: "Erro interno do servidor.",
          details: "Erro ao buscar usuários",
        });
    }
})


module.exports = AdminsRouter