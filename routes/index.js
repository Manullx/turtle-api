
const { Router } = require("express");

const IndexRouter = Router();

IndexRouter.use(require("./CoursesRouter"));
IndexRouter.use(require("./StudentsRouter"));
IndexRouter.use(require("./CompaniesRouter.js"));

module.exports = IndexRouter;
