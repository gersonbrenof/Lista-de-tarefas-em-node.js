const express = require("express");
const tarefaRouter = require("./routes/tarefa.router")
const setupSwagger = require("./swagger")
const app = express();

app.use(express.json());

app.use("/tarefa", tarefaRouter);
setupSwagger(app)
app.get("/", (req, res) => {
  res.json({ message: "heelo word minha pi esta funcionado!" });
});

module.exports = app;   
