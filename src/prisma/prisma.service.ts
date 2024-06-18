import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

let prismaGlobal: PrismaClient;

function prismaClientSingleton() {
  if (!prismaGlobal) {
    prismaGlobal = new PrismaClient();
  }
  return prismaGlobal;
}

const prisma = prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prismaGlobal = prisma;
}
