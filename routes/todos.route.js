const express = require("express");
const { TodoModel } = require("../models/Todo.model");

const todosRouter = express.Router();

todosRouter.get("/", async (request, response) => {
  const todos = await TodoModel.find();
  response.send(todos);
});

module.exports = { todosRouter };
