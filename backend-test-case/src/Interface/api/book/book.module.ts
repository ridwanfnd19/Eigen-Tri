import { Module } from '@nestjs/common';
import { BookController } from './book.controller.js';
import { ContainerModule } from 'src/Infrastructures/container/container.module.js';

@Module({
  imports: [ContainerModule.register()],
  controllers: [BookController],
})
export class BookModule {}
