
const { Router } = require("express");

const IndexRouter = Router();

IndexRouter.use(require("./coursesRouter"));

module.exports = IndexRouter;
