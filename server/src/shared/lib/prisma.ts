import {PrismaClient} from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import pg from 'pg';
import injectDeletedAtFilter, {softDeleteModels} from '../utils/inject-deleted-at-filter';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({connectionString});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });
export const prisma = basePrisma.$extends({
  name: 'softDeleteExtension',
  query: {
    $allModels: {
      findMany({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      findFirst({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      findFirstOrThrow({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      findUnique({model, args, query}: {model: string; args: any; query: any}) {
        // Prisma throws if deletedAt is added to unique, so convert to findFirst
        args = injectDeletedAtFilter(model, args);
        if ((softDeleteModels as readonly string[]).includes(model)) {
          return (basePrisma as any)[model].findFirst(args);
        }
        return query(args);
      },
      findUniqueOrThrow({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        if ((softDeleteModels as readonly string[]).includes(model)) {
          return (basePrisma as any)[model].findFirstOrThrow(args);
        }
        return query(args);
      },
      update({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      updateMany({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      upsert({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      aggregate({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      groupBy({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      },
      delete({model, args, query}: {model: string; args: any; query: any}) {
        if ((softDeleteModels as readonly string[]).includes(model)) {
          return (basePrisma as any)[model].update({
            ...args,
            data: {deletedAt: new Date()}
          });
        }
        return query(args);
      },
      deleteMany({model, args, query}: {model: string; args: any; query: any}) {
        if ((softDeleteModels as readonly string[]).includes(model)) {
          return (basePrisma as any)[model].updateMany({
            where: args.where,
            data: {deletedAt: new Date()}
          });
        }
        return query(args);
      },
      count({model, args, query}: {model: string; args: any; query: any}) {
        args = injectDeletedAtFilter(model, args);
        return query(args);
      }
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
