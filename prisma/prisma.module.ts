import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // این خیلی مهمه
@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // فقط PrismaService، نه PrismaModule
})
export class PrismaModule {}
