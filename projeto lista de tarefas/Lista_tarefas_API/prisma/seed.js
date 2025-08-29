const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const tarefas = [
        {
            titulo: "Comprar leite",
            discricao: "Ir ao mercado e comprar leite integral",
            concluida: false
        },
        {
            titulo: "Estudar Node.js",
            discricao: "Ler documentação do Express e Prisma",
            concluida: false
        },
        {
            titulo: "Limpar a casa",
            discricao: "Aspirar o chão e limpar a cozinha",
            concluida: true
        }
    ];

    for (const tarefa of tarefas) {
        await prisma.tarefa.create({ data: tarefa });
    }

    console.log("Seed finalizado!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
