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

    https://storify-ymie.onrender.com/upload

    Bruce Wayne
    bruce.wayne@batmail.com
    12349876
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