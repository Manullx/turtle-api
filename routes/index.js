
const { Router } = require("express");

const IndexRouter = Router();

IndexRouter.use(require("./CoursesRouter"));
IndexRouter.use(require("./StudentsRouter"));
IndexRouter.use(require("./CompaniesRouter.js"));
IndexRouter.use(require("./RegistersRouter.js"));

module.exports = IndexRouter;
