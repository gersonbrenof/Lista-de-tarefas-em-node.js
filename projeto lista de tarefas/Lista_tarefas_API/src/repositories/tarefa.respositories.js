const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


class TarefaRepositories{
    async findAll(){
        return prisma.Tarefa.findMany()// equivalente ao select from tarefa

    }
    async findById(id){
        return await prisma.tarefa.findUnique({where: {id:Number(id)}})
    }
    async create(data){
        return await prisma.tarefa.create({
            data:{
                titulo: data.titulo,
                discricao: data.discricao,
                concluida:data.concluida ?? false  // para deixa false
            }
        });// iquelivaente ao insert into na tarefas

    }
    async update(id, data){  //o where pra pega pelo id qual tarefas vai selcionado para atualizar e o data seria os dados dessa tarefa
        return  await prisma.Tarefa.update({where : {id}, 
            data: {titulo: data.titulo,
                discricao: data.discricao,
                concluida:data.concluida 
            }
        });

        //para faze a aulualizaçao da minshas tarefas
    }
    async delete(id){
        return await prisma.Tarefa.delete({where: {id}})
    }
}
module.exports = new TarefaRepositories