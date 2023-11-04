import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db;
}

/**
 * 
 * we create a single prisma client and save it in globalThis so that every single
 * hot reloading it will ask if the prisma client is defined inside globalThis it will not 
 * create a new prisma client 
 * 
 * if we ignore doing things like that a new prisma clinet will be created every single hot 
 * reloading that's comming to the view 
 * 
 * to recap, the idea behaind using the globalThis object is just to initialize the db variable
 * with an new prismaClient just once; 
 * to prevent the overflow error  that may happen due to infinte numbr 
 * of initilization for the db variable with new prisma client
 */
export default db;