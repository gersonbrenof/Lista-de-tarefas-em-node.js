const TarefaRepositories = require("../repositories/tarefa.respositories")

class TarefaService{
    // lsita todas as tarefas

    async getAll(){
        return await TarefaRepositories.findAll(); // vai puxa todas as tarefas disponivel
    }
    async getId(id){
        return await TarefaRepositories.findById(id);
    }
    async createTarefa(data) {
    console.log("Dados recebidos:", data);

    if (!data.titulo || data.titulo.trim() === "") {
        throw new Error("O título da tarefa é obrigatório");
    }

    if (!data.discricao || data.discricao.trim() === "") {
        throw new Error("A descrição é obrigatória");
    }

    // Chama o repositório para criar a tarefa no banco
    return await TarefaRepositories.create(data);
}

    //atualizar a tarefa
    async updateTarefa(id , data){
        const tarefaExist = await TarefaRepositories.findById(id);
        if (!tarefaExist){
            throw new Error("Tarefa nao encontrada");
        }
        return await TarefaRepositories.update(id, data)
    }
    async deleteTarefa(id){
        const tarefaExist = await TarefaRepositories.findById(id)
        if (!tarefaExist){
            throw new Error("Tarefa nao encontrada");
        }
        return await TarefaRepositories.delete(id);
    }

    async concluir_tarefa(id){
        try{
            if (!id){
                throw new Error("o ID da tarefa e obrigatorio");
                
            }
            // para altera o cmapo para true quadno for passad oncluir tarefa
            const tarefaAtulizada = await TarefaRepositories.update(id ,{concluida: true})
            if(!tarefaAtulizada){
                throw new Error("tarefa nao encontrada")
            }
        }catch (err){
            console.error(`Erro ao concluir a tarefa: ${err.message}`)
            throw new Error(`Não foi possível concluir a tarefa: ${err.message}`);
        }
    }
}
module.exports = new TarefaService();