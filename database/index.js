
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("souzatreinamentos", process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: "mysql",
    host: "localhost",
    logging: false
});

sequelize.authenticate().then(_ => {
    console.log("Banco de dados autenticado com sucesso")
}).catch((err) => {
    throw err
});

module.exports = sequelize;