import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting database connection limit.
//
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient

prisma = new PrismaClient()
// if (process.env.NODE_ENV === 'production') {
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient()
//   }
//   prisma = global.prisma
// }
export default prisma
