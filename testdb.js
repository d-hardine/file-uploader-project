const { PrismaClient } = require('./generated/prisma')

const prisma = new PrismaClient()

async function main() {
    /*
    const findUser = await prisma.user.findUnique({
        where: {
            username: 'clark.kent'
        }
    })
    console.log(findUser)
    */
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })