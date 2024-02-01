
const { Router } = require("express");

const IndexRouter = Router();

IndexRouter.use(require("./CoursesRouter"));

module.exports = IndexRouter;
