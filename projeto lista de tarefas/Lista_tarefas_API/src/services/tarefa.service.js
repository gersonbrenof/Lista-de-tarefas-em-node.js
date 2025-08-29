const tarefaRespositories = require("../repositories/tarefa.respositories");
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
            if (!id){
                throw new Error("o ID da tarefa e obrigatorio");
                
            }
               const tarefa = await tarefaRespositories.findById(id);
            if(!tarefa){
                throw new Error("Tarefa nao foi encontrada.")
            }
            // verifica se a atrefa ja foi ocncluida
            if(tarefa.concluida){
                throw new Error("A tarefa ja foi concluida.")
            }
            // para altera o cmapo para true quadno for passad oncluir tarefa
            const tarefaAtulizada = await tarefaRespositories.update(id ,{concluida: true})
            
            if(!tarefaAtulizada){
                throw new Error("tarefa nao encontrada")
            }
      return tarefaAtulizada;
    }
}
module.exports = new TarefaService();