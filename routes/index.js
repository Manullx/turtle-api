
const { Router } = require("express");

const IndexRouter = Router();

IndexRouter.use(require("./CoursesRouter"));
IndexRouter.use(require("./StudentsRouter"));

module.exports = IndexRouter;
