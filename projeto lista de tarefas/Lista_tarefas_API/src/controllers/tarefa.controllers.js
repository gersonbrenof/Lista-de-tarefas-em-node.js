const tarefaRespositories = require("../repositories/tarefa.respositories");
const TarefaService = require("../services/tarefa.service");
class TarefaController{
    async lista_id(request, response){
        try{
            const {id} = request.params;
            const tarefa = await TarefaService.getId(id);
            if (!tarefa){
                return response.status(404).json({error:"Tarefa nao encontrada"})
            }
            response.json(tarefa);
        }catch (err){
            response.status(500).json({error: err.message})
        }
    }
    async listar(request, response){
        try{
        const tarefa = await TarefaService.getAll();
        response.json(tarefa);
    } catch (err) {
        response.status(500).json({error: err.message});
    }  
    }    
    // cria a tarefa
    async create(request, response){
        try{
            
            const tarefa = await TarefaService.createTarefa(request.body);
            response.status(201).json(tarefa)
        }catch (err){
            response.status(400).json({error: err.message})
        
        }
    }
        //atauliza tarefa
    async update(request, response){
        try{
            const {id} = request.params;
            const data = request.body;
            const tarefa = await TarefaService.updateTarefa(Number(id), data);
            response.json(tarefa)
        }catch (err){
            response.status(400).json({error: err.message});
        }
    }
    // deleta tarefa

    async delete(request, response){
        try{
        const {id} = request.params;
        await TarefaService.deleteTarefa(Number(id))
        response.status(204).send();
        } catch  (err){
            response.status(400).json({error: err.message});
            }
        }

        async concluir(request, response) {
        try {
            const { id } = request.params;

            if (!id) {
            return response.status(400).json({ error: "Id da tarefa é obrigatório" });
            }

            const tarefaAtualizada = await TarefaService.concluir_tarefa(Number(id));

            return response.status(200).json({
            message: "Tarefa concluída com sucesso",
            tarefa: tarefaAtualizada
            });
        } catch (err) {
          const msg = err && err.message ? err.message.toLowerCase() : "";

         console.error(`Erro no controller ao concluir a tarefa: ${err?.message || err}`);

        if (msg.includes("não foi encontrada")) {
            return response.status(404).json({ error: err?.message || "Tarefa não encontrada" });
        }

        if (msg.includes("ja foi concluida")) {
            return response.status(409).json({ error: err?.message || "Tarefa já foi concluída" });
        }

        if (msg.includes("obrigatório")) {
             return response.status(400).json({ error: err?.message || "ID obrigatório" });
        }

        return response.status(500).json({ error: "Erro interno no servidor" });
            }
        }
    } 

module.exports = new TarefaController