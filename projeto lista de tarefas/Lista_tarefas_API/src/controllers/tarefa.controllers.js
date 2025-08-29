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

        async concluir(request, response){
            try{
            const {id} = request.params;
             if(!id){
                 return response.status(400).json({error: "Id da tarefa é obrigaorio"})
            }
            const tarefaAtulizada = await TarefaService.concluir_tarefa(Number(id));
            return response.json({
                message: "Tarefa concluida com sucesso",
                tarefa: tarefaAtulizada
            })
            }catch (err){
                console.error(`Erro no controller ao concluir a tarefa: ${err.message}`);
                return response.status(500).json({ error: err.message });
            }
          
        
        }
    } 

module.exports = new TarefaController