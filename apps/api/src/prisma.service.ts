import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { SEED_DB_BASE64 } from './seed-base64';

function ensureDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    if (process.env.VERCEL) {
      const tmpDb = '/tmp/dev.db';
      process.env.DATABASE_URL = `file:${tmpDb}`;
      initSqliteFile(tmpDb);
    } else {
      process.env.DATABASE_URL = 'file:./dev.db';
    }
  } else if (process.env.VERCEL && process.env.DATABASE_URL.startsWith('file:')) {
    const dbPath = process.env.DATABASE_URL.replace(/^file:/, '');
    initSqliteFile(dbPath);
  }
}

function initSqliteFile(targetPath: string) {
  try {
    if (!fs.existsSync(targetPath)) {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, Buffer.from(SEED_DB_BASE64, 'base64'));
    }
  } catch (e) {
    console.error('Failed to initialize SQLite DB from base64 seed:', e);
  }
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    ensureDatabaseUrl();
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      console.error('Prisma connection error during initialization:', e);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (e) {
      console.error('Prisma disconnect error:', e);
    }
  }
}
