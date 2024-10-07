import { Module } from '@nestjs/common';
import { ContainerModule } from 'src/Infrastructures/container/container.module.js';
import { BorrowController } from './borrow.controller.js';

@Module({
  imports: [ContainerModule.register()],
  controllers: [BorrowController],
})
export class BorrowModule {}
