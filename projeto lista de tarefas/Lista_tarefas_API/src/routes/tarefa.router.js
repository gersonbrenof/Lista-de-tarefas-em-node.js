const express = require("express");
const router = express.Router(); 
const TarefaController = require("../controllers/tarefa.controllers");
const { request, response } = require("../app");
const tarefaControllers = require("../controllers/tarefa.controllers");
/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: Operações relacionadas a tarefas
 */

/**
 * @swagger
 * /tarefa:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   discricao:
 *                     type: string
 *                   concluida:
 *                     type: boolean
 *                   data_criacao:
 *                     type: string
 *                     format: date-time
 */
router.get("/", (request, response) => TarefaController.listar(request, response));

/**
 * @swagger
 * /tarefa/{id}:
 *   get:
 *     summary: pega tarefa pleo id
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarefa deletada com sucesso
 */
router.get("/:id", (request, response)=> tarefaControllers.lista_id(request,response))



/**
 * @swagger
 * /tarefa:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - discricao
 *             properties:
 *               titulo:
 *                 type: string
 *               discricao:
 *                 type: string
 *               concluida:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 */
router.post("/", (request, response) => TarefaController.create(request, response));

/**
 * @swagger
 * /tarefa/{id}:
 *   put:
 *     summary: Atualiza uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               discricao:
 *                 type: string
 *               concluida:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 */
router.put("/:id", (request, response)=> TarefaController.update(request, response));

/**
 * @swagger
 * /tarefa/{id}:
 *   delete:
 *     summary: Deleta uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarefa deletada com sucesso
 */
router.delete("/:id", (request,response)=> TarefaController.delete(request, response));

/**
 * @swagger
 * /tarefa/concluir/{id}:
 *   patch:
 *     summary: concluir a tarefas
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: ocncluir a tarefa para true
 */
router.patch("/concluir/:id", (request, response)=> TarefaController.concluir(request, response));
module.exports = router;
